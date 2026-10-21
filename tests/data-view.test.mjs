import test from 'node:test';
import assert from 'node:assert/strict';
import { dataViewGridPageSize, dataViewPageNumbers, filterDataViewItems, paginateDataViewItems } from '../src/lib/components/data-view/data.ts';

const users = [
  { id: '1', name: 'Inês Matos', email: 'ines@example.com', role: 'member', status: 'active' },
  { id: '2', name: 'Daniel Lopes', email: 'daniel@example.com', role: 'admin', status: 'active' },
  { id: '3', name: 'Ana Costa', email: 'ana@example.com', role: 'member', status: 'invited' },
];
const filters = ['role', 'status'].map((id) => ({ id, label: id, options: [], getValue: (user) => user[id] }));
const searchValue = (user) => Object.values(user).join(' ');

test('data view combines accent-insensitive multiword search with all selected filters', () => {
  assert.deepEqual(filterDataViewItems(users, '  MATOS ines ', searchValue, filters, {}).map(user => user.id), ['1']);
  assert.deepEqual(filterDataViewItems(users, 'example.com', searchValue, filters, { role: 'member', status: 'active' }).map(user => user.id), ['1']);
  assert.deepEqual(filterDataViewItems(users, 'daniel', searchValue, filters, { role: 'member' }), []);
  assert.deepEqual(filterDataViewItems(users, '', searchValue, filters, { role: '', status: '' }), users);
  assert.deepEqual(filterDataViewItems(users, 'missing', searchValue, filters, {}), []);
});

test('data view paginates the filtered result and clamps after deletion or size changes', () => {
  const items = Array.from({ length: 13 }, (_, index) => ({ id: index }));
  const last = paginateDataViewItems(items, 3, 6);
  assert.deepEqual(last.items, [{ id: 12 }]);
  assert.deepEqual([last.page, last.pageCount, last.from, last.to, last.total], [3, 3, 13, 13, 13]);
  const deleted = paginateDataViewItems(items.slice(0, 12), 3, 6);
  assert.deepEqual([deleted.page, deleted.from, deleted.to], [2, 7, 12]);
  const filtered = filterDataViewItems(users, '', searchValue, filters, { status: 'active' });
  assert.equal(paginateDataViewItems(filtered, 8, 6).page, 1);
  assert.equal(paginateDataViewItems(items, 3, 12).page, 2);
  assert.equal(items.length, 13);
});

test('data view handles an empty list and invalid pagination arguments', () => {
  const empty = paginateDataViewItems([], 4, 6);
  assert.deepEqual([empty.items, empty.page, empty.pageCount, empty.from, empty.to], [[], 1, 1, 0, 0]);
  for (const size of [0, -1, NaN, Infinity]) assert.equal(paginateDataViewItems(users, 1, size).pageSize, 6);
  for (const page of [0, -1, NaN, Infinity]) assert.equal(paginateDataViewItems(users, page, 1).page, 1);
  assert.equal(paginateDataViewItems(users, 1, 0.5).pageSize, 1);
});

test('pagination numbers include the first and last page without duplicates or excessive buttons', () => {
  assert.deepEqual(dataViewPageNumbers(1, 1), [1]);
  assert.deepEqual(dataViewPageNumbers(1, 3), [1, 2, 3]);
  assert.deepEqual(dataViewPageNumbers(5, 10), [1, 'gap', 4, 5, 6, 'gap', 10]);
  assert.deepEqual(dataViewPageNumbers(10, 10), [1, 'gap', 9, 10]);
});

test('card pagination rounds up to complete responsive grid rows', () => {
  for (const size of [6, 12, 18]) {
    for (const columns of [1, 2, 3, 4, 5, 6, 7]) {
      const result = dataViewGridPageSize(size, columns);
      assert.equal(result % columns, 0);
      assert.ok(result >= size && result < size + columns);
      const items = Array.from({ length: 200 }, (_, index) => index);
      const pages = Array.from({ length: Math.ceil(items.length / result) }, (_, page) => paginateDataViewItems(items, page + 1, result).items);
      assert.deepEqual(pages.flat(), items);
    }
  }
  assert.equal(dataViewGridPageSize(6, 4), 8);
  assert.equal(dataViewGridPageSize(NaN, 0), 6);
});
