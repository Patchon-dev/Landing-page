type SerializedFormData = Record<string, unknown>;

export interface AvatarUser {
	name?: string | null;
	profile_picture?: string | null;
	image?: string | null;
	store_logo?: string | null;
	company_logo?: string | null;
	profilePicture?: string | null;
	photo_url?: string | null;
}

interface CookieOptions { path: string; maxAge?: number }
interface SessionCookies {
	set(name: string, value: string, options: CookieOptions): void;
	delete(name: string, options: CookieOptions): void;
}
interface SessionEvent {
	locals: { user?: unknown; token?: unknown };
	cookies: Pick<SessionCookies, 'delete'>;
}

interface QuestionResponse { response?: unknown }
interface ChecklistQuestion {
	id: number;
	parent_id?: number | null;
	children?: ChecklistQuestion[];
	question_type?: { code?: string };
	checklist_question_responses?: QuestionResponse[];
	[key: string]: unknown;
}
interface ChecklistSection {
	subsections?: { groups?: { questions?: ChecklistQuestion[] }[] }[];
}

function setValue(data: unknown, keys: string[], value: FormDataEntryValue): unknown {
	if (keys.length === 0) {
		// Leaf node
		return value;
	}

	let key = keys.shift();
	if (!key) {
		data = data || [];
		if (Array.isArray(data)) {
			key = data.length.toString();
		}
	}

	// Try converting key to a numeric value
	const index = +key!;
	if (!isNaN(index)) {
		// We have a numeric index, make data a numeric array
		data = data || [];
		key = index.toString();
	}

	// If none of the above matched, we have an associative array
	data = data || {};

	// Assert data as Record to handle properties access
	const record = data as Record<string | number, unknown>;
	const val = setValue(record[key!], keys, value);
	record[key!] = val;

	return record;
}

export function serializeForm(formData: FormData): SerializedFormData {
	return Array.from(formData.entries()).reduce<SerializedFormData>((data, [field, value]) => {
		const match = field.match(/^([^[]+)((?:\[[^\]]*\])*)/);
		if (!match) return data;

		const [, prefix, keysStr] = match;

		if (keysStr) {
			const keys = Array.from(keysStr.matchAll(/\[([^\]]*)\]/g), (m) => m[1]);
			data[prefix] = setValue(data[prefix], keys, value);
		} else {
			data[prefix] = value;
		}

		return data;
	}, {});
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
	return items.reduce(
		(result, item) => {
			const groupKey = item[key] as unknown as string;
			(result[groupKey] = result[groupKey] || []).push(item);
			return result;
		},
		{} as Record<string, T[]>
	);
}

export const randomNum = (min = 1, max = 10) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomString = (len = 8) => {
	return Math.random().toString(36).substring(len);
};

export const normalizeString = (str: string) => {
	return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

export const cleanRedirectTo = (url: URL) => {
	const redirectTo = url.searchParams.get('redirectTo') ?? '';
	if (!redirectTo) return undefined;
	if (['logout', 'login', '2fa'].includes(redirectTo)) {
		return undefined;
	}

	return `/${redirectTo}`;
};

export const getRedirectToUrl = (url: URL) => {
	if (url.searchParams.has('redirectTo')) {
		url.searchParams.delete('redirectTo');
	}

	const redirectTo = url.href.replace(url.origin + '/', '');
	if (redirectTo && !['logout', 'login', '2fa'].includes(redirectTo)) {
		return `/login?redirectTo=${redirectTo}`;
	}

	return '/login';
};

export const cleanSessionData = (event: SessionEvent) => {
	event.locals.user = undefined;
	event.locals.token = undefined;
	event.cookies.delete("COOKIE_NAME", { path: '/' });
};

export const getInitials = (string: string) => {
	if (!string) return '';
	const names = string.split(' ');
	let initials = names[0].substring(0, 1).toUpperCase();

	if (names.length > 1) {
		initials += names[names.length - 1].substring(0, 1).toUpperCase();
	}
	return initials;
};

export const getAvatarUrl = (user: AvatarUser | null | undefined) => {
	if (!user?.profile_picture && !user?.image && !user?.store_logo && !user?.company_logo && !user?.profilePicture && !user?.photo_url) return '';

	if (user.profile_picture) {
		return `${user.profile_picture}`;
	} else if (user.image) {
		return `${user.image}`;
	} else if (user.store_logo) {
		return `${user.store_logo}`
	} else if (user.company_logo) {
		return `${user.company_logo}`
	} else if (user.profilePicture) {
		return `${user.profilePicture}`
	} else if (user.photo_url) {
		return `${user.photo_url}`
	}
};

export async function downloadFile(url: string) {
	const res = await fetch(url);
	const blob = await res.blob();

	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);

	// pick a filename (from URL or default)
	const filename = url.split('/').pop() || 'download';
	link.download = filename;

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(link.href);
}

export const parseParamsToAPI = (params: URLSearchParams) => {
	const paramsObj: Record<string, string> = {};
	const page = params.get('page') || '1';
	const limit = params.get('per_page') || '10';
	if (params.has('search')) paramsObj.q = params.get('search') ?? '';
	if (params.has('sortBy')) paramsObj.sortBy = params.get('sortBy') ?? '';
	if (params.has('order')) paramsObj.order = params.get('order') ?? '';
	paramsObj.limit = limit;
	paramsObj.skip = `${(parseInt(page) - 1) * parseInt(limit)}`;

	return paramsObj;
};

export function onUploadHandler(e: Event, previewAvatarUrl?: string) {
	const input = e.target as HTMLInputElement;

	if (previewAvatarUrl) {
		URL.revokeObjectURL(previewAvatarUrl); // free memory
	}
	const file = input.files?.[0];
	return file ? URL.createObjectURL(file) : '';
}

export const setCookies = (cookies: Pick<SessionCookies, 'set'>, _user: unknown, token?: string) => {
	cookies.set(`_user_session_token`, `${token}`, {
		path: `/`,
		maxAge: 60 * 60 * 24 * 30
	});
};

export function flattenFilters(filters: Record<string, unknown>) {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value == null) continue;

    // case: { value, label }
    if (typeof value === "object" && "value" in value) {
      flattened[key] = String(value.value);
    } 
    // case: primitive (string, number, boolean)
    else {
      flattened[key] = String(value);
    }
  }

  return flattened;
}

export function countFilterParams(url: string = window.location.href) {

	const filtersToExcludeFromCount = ["search", "page", "per_page", "sort_column", "sort_direction"];
	const params = new URL(url).searchParams;
	
	let count = 0;
	for (const key of params.keys()) {
		if (filtersToExcludeFromCount.includes(key)) continue;
		count++;
	}

	return count;
}

export function wrapFormKeys(formData: FormData, prefix: string) {
    const keys = Array.from(formData.keys());

    keys.forEach((key) => {
        const values = formData.getAll(key);
        if (!values.length) return;

        const match = key.match(/^([^[]+)(.*)$/);
        if (!match) return;

        const [, root, rest] = match;
        const newKey = `${prefix}[${root}]${rest}`;

        // Delete old key
        formData.delete(key);

        // Append all values
        for (const value of values) {
            formData.append(newKey, value);
        }
    });

    return formData;
}

export function getCaptionColor(caption: 'completed' | 'inner_task' | 'in_progress' | 'pending_acceptance' | 'accepted' | 'pending' | 'busy' | 'awaiting_submission' | 'grey_inner_task') {
	if (caption == 'accepted') return '#007BFF';
	else if (caption == 'completed') return '#2fd074';
	else if (caption == 'inner_task') return '#e052b1';
	else if (caption == 'pending') return '#f49d25';
	else if (caption == 'busy') return '#e44444';
	else if (caption == 'in_progress') return '#3c71dd';
	else if (caption == 'pending_acceptance') return '#f4b625';
	else if (caption == 'awaiting_submission') return '#995cd6';
	else if (caption == 'grey_inner_task') return '#1e1e1e';
}

export function getTableBorderCaptionColor(
	caption: 'accepted' | 'pending' | 'busy' | string,
	intreventionDate: string
) {
	const currentDate = new Date();
	const dateOfIntrevention = new Date(intreventionDate);
	currentDate.setHours(0, 0, 0, 0);
	dateOfIntrevention.setHours(0, 0, 0, 0);

	if (caption == 'done') return 'border-[#00CC99]';
	else if (caption == 'ongoing') return 'border-[#4C99F2]';
	else if ((caption == 'scheduled' || caption == 'upcoming') && currentDate > dateOfIntrevention)
		return 'border-[#F2C94C]';
	else return 'border-[#ADADAD]';
}

export function formatDateTime(
	isoString: string,
	includeHours: boolean = false
): string {
	const date = new Date(isoString);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	const baseDate = `${day}/${month}/${year}`;

	if (!includeHours) return baseDate;

	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${baseDate} ${hours}:${minutes}`;
}

export function formatToHHMM(dateString: string): string {
	const date = new Date(dateString);

	return date.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
}

const localeMap: Record<string, string> = {
	pt: 'pt-PT',
	en: 'en-GB',
	fr: 'fr-FR',
	es: 'es-ES'
};

export function formatWrittenDate(
	dateString: string,
	locale: string
): string {
	const normalizedLocale = localeMap[locale] ?? 'en-GB';

	const date = new Date(dateString);

	return new Intl.DateTimeFormat(normalizedLocale, {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).format(date);
}


export async function blobUrlToFile(blobUrl: string, filename = "image.jpg") {
	const res = await fetch(blobUrl);
	const blob = await res.blob();
	const nameOfTheFileWithExtension = blob instanceof File ? blob.name : filename;
	return new File([blob], nameOfTheFileWithExtension, { type: blob.type });
}

export function normalizeImageKeys(formDataObj: Record<string, string | Blob>) {
	const newFormData = new FormData();

	Object.entries(formDataObj).forEach(([key, value]) => {
		// Regex para apanhar [images][0], [images][1], etc.
		const imageMatch = key.match(/(.*\[images])\[\d+\]$/);

		if (imageMatch) {
			const newKey = `${imageMatch[1]}[]`;
			newFormData.append(newKey, value);
		} else {
			newFormData.append(key, value);
		}
	});

	return newFormData;
}

export function isParentFalse(question: Pick<ChecklistQuestion, 'parent_id'>, answers: Record<number, unknown>): boolean {
    if (!question.parent_id) return false;

    const parentValue = answers[question.parent_id];

    return parentValue === false;
}

export function buildQuestionMap(sections: ChecklistSection[]) {
    const map: Record<number, ChecklistQuestion> = {};

    function traverse(questions: ChecklistQuestion[], parentId: number | null = null) {
        for (const q of questions) {
            // 👇 guardas também o parent
            map[q.id] = {
                ...q,
                parent_id: parentId
            };

            if (q.children?.length) {
                traverse(q.children, q.id);
            }
        }
    }

    sections?.forEach(section => {
        section?.subsections?.forEach((sub) => {
            sub?.groups?.forEach((group) => {
                traverse(group.questions ?? []);
            });
        });
    });

    return map;
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

type AnswerMap = Record<number, unknown>;

export function buildAnswerMap(sections: ChecklistSection[], answers: AnswerMap): AnswerMap {
	const result: AnswerMap = {};

	function parseResponse(question: ChecklistQuestion, response: QuestionResponse): unknown {
		if (!response) return undefined;

		const type = question?.question_type?.code;

		switch (type) {
			case 'multiple_select':
				try {
					return JSON.parse(String(response.response || '[]'));
				} catch {
					return response.response;
				}

			case 'date_blocked':
			case 'time':
				return response.response ?? undefined;

			default:
				return response.response ?? undefined;
		}
	}

	function processQuestion(question: ChecklistQuestion) {
		const id = question.id;

		let value =
			question.checklist_question_responses?.[0]
				? parseResponse(question, question.checklist_question_responses[0])
				: undefined;

		if (answers?.[id] !== undefined && answers?.[id] !== null) {
			value = answers[id];
		}

		result[id] = value;

		if (question.children?.length) {
			for (const child of question.children) {
				processQuestion(child);
			}
		}
	}

	for (const section of sections) {
		for (const subsection of section.subsections ?? []) {
			for (const group of subsection.groups ?? []) {
				for (const question of group.questions ?? []) {
					processQuestion(question);
				}
			}
		}
	}

	return result;
}
