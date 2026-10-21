export const now = (): string => {
	return new Date().toLocaleString('pt-PT', { timeZone: 'UTC' });
};

export const formatDateLong = (date: Date | string | number): string => {
	return new Date(date).toLocaleDateString('pt-PT', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

export const formatDateLongWithWeekday = (date: Date | string | number, locale: string = 'pt-PT'): string => {
	return new Date(date).toLocaleDateString(locale, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

export const formatTimeLong = (date: Date | string | number): string => {
	return new Date(date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
};

export const formattedDateTime = (date: Date | string | number): string => {
	return new Date(date).toLocaleString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false // 24h format
	});
};

export const formatDateTimeLong = (date: Date | string | number): string => {
	return new Date(date).toLocaleDateString('pt-PT', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
};

export const formatSeconds = (time: number): string => {
	if (!time) return '0s';

	// Hours, minutes and seconds
	// ~~ is a shorthand for Math.floor
	const hrs = ~~(time / 3600);
	const mins = ~~((time % 3600) / 60);
	const secs = ~~time % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	let ret = '';
	if (hrs > 0) {
		ret += `${hrs}h${mins < 10 ? '0' : ''}`;
	}

	if (mins > 0) {
		ret += `${mins}m${secs < 10 ? '0' : ''}`;
	}

	if (time < 60 && !Number.isInteger(time)) {
		ret += `${secs}.${time.toString().split('.')[1][0]}s`;
	} else {
		ret += `${secs}s`;
	}

	return ret;
};
