import test from 'node:test';
import assert from 'node:assert/strict';
import {
  serializeForm, flattenFilters, wrapFormKeys, normalizeImageKeys,
  buildQuestionMap, buildAnswerMap, isParentFalse, getAvatarUrl, getInitials,
  onUploadHandler, blobUrlToFile, cleanSessionData, setCookies,
} from '../src/lib/utils/helpers.ts';

test('serializes nested objects, repeated array fields and indexed rows', () => {
  const form = new FormData();
  for (const [key, value] of [['name', 'Ada'], ['address[city]', 'Porto'], ['tags[]', 'react'], ['tags[]', 'css'], ['tasks[0][title]', 'First'], ['tasks[1][title]', 'Second']]) form.append(key, value);
  assert.deepEqual(serializeForm(form), { name: 'Ada', address: { city: 'Porto' }, tags: ['react', 'css'], tasks: [{ title: 'First' }, { title: 'Second' }] });
});

test('keeps false and zero filters, unwraps selected values and omits empty values', () => {
  assert.deepEqual(flattenFilters({ status: { value: 0, label: 'Zero' }, active: false, query: 'demo', empty: null, missing: undefined }), { status: '0', active: 'false', query: 'demo' });
});

test('prefixes form keys while preserving repeated file entries', () => {
  const form = new FormData();
  form.append('name', 'Ada'); form.append('images[]', 'one'); form.append('images[]', 'two');
  assert.equal(wrapFormKeys(form, 'profile'), form);
  assert.equal(form.get('profile[name]'), 'Ada');
  assert.deepEqual(form.getAll('profile[images][]'), ['one', 'two']);
  assert.equal(form.has('images[]'), false);
});

test('normalizes image arrays without losing uploaded files', () => {
  const file = new File(['image'], 'photo.png', { type: 'image/png' });
  const form = normalizeImageKeys({ 'profile[images][0]': file, 'profile[images][1]': 'existing.png', title: 'Photo' });
  assert.deepEqual(form.getAll('profile[images][]'), [file, 'existing.png']);
  assert.equal(form.get('title'), 'Photo');
});

const sections = [{ subsections: [{ groups: [{ questions: [
  { id: 1, children: [{ id: 2, question_type: { code: 'multiple_select' }, checklist_question_responses: [{ response: '["a","b"]' }] }] },
  { id: 3, question_type: { code: 'multiple_select' }, checklist_question_responses: [{ response: 'invalid' }] },
  { id: 4, question_type: { code: 'time' }, checklist_question_responses: [{ response: '10:30' }] },
] }] }] }];

test('maps nested questions and their parent relationships', () => {
  const map = buildQuestionMap(sections);
  assert.equal(map[1].parent_id, null); assert.equal(map[2].parent_id, 1);
  assert.equal(isParentFalse(map[2], { 1: false }), true);
  assert.equal(isParentFalse(map[2], { 1: true }), false);
  assert.deepEqual(buildQuestionMap([{ subsections: [{ groups: [{}] }] }]), {});
});

test('parses saved answers, retains malformed responses and respects false overrides', () => {
  assert.deepEqual(buildAnswerMap(sections, { 1: false }), { 1: false, 2: ['a', 'b'], 3: 'invalid', 4: '10:30' });
  assert.deepEqual(buildAnswerMap(sections, { 2: [] })[2], []);
});

test('avatar values handle missing users and choose the first image source', () => {
  assert.equal(getAvatarUrl(undefined), ''); assert.equal(getAvatarUrl(null), '');
  assert.equal(getAvatarUrl({ profile_picture: 'first.png', image: 'second.png' }), 'first.png');
  assert.equal(getAvatarUrl({ photo_url: 'fallback.png' }), 'fallback.png');
  assert.equal(getInitials('Ada Lovelace'), 'AL'); assert.equal(getInitials(''), '');
});

function uploadEvent(files) {
  const event = new Event('change');
  Object.defineProperty(event, 'target', { value: { files } });
  return event;
}

test('clears an empty file selection and revokes the previous preview', async () => {
  const previous = URL.createObjectURL(new Blob(['old']));
  assert.equal(onUploadHandler(uploadEvent([]), previous), '');
  await assert.rejects(fetch(previous));
});

test('creates a usable preview and converts a blob URL into a named file', async () => {
  const preview = onUploadHandler(uploadEvent([new File(['image'], 'upload.png', { type: 'image/png' })]));
  try {
    const file = await blobUrlToFile(preview, 'avatar.png');
    assert.equal(file.name, 'avatar.png'); assert.equal(file.type, 'image/png'); assert.equal(await file.text(), 'image');
  } finally { URL.revokeObjectURL(preview); }
});

test('session helpers keep the cookie contract and clear local authentication', () => {
  const deleted = [], written = [];
  const event = { locals: { user: { name: 'Ada' }, token: 'old' }, cookies: { delete: (...args) => deleted.push(args) } };
  cleanSessionData(event);
  assert.equal(event.locals.user, undefined); assert.equal(event.locals.token, undefined);
  assert.deepEqual(deleted, [['COOKIE_NAME', { path: '/' }]]);
  setCookies({ set: (...args) => written.push(args) }, {}, 'new-token');
  assert.deepEqual(written, [['_user_session_token', 'new-token', { path: '/', maxAge: 2592000 }]]);
});
