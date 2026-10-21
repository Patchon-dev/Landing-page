export interface DataViewFilter<T> {
  id: string;
  label: string;
  options: readonly { value: string; label: string }[];
  getValue: (item: T) => string;
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function filterDataViewItems<T>(items: readonly T[], search: string, getSearchValue: (item: T) => string, filters: readonly DataViewFilter<T>[], values: Readonly<Record<string, string>>): T[] {
  const terms = normalize(search).trim().split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (!filters.every((filter) => !values[filter.id] || filter.getValue(item) === values[filter.id])) return false;
    const text = normalize(getSearchValue(item));
    return terms.every((term) => text.includes(term));
  });
}

export function paginateDataViewItems<T>(items: readonly T[], requestedPage: number, requestedSize: number) {
  const pageSize = Number.isFinite(requestedSize) && requestedSize > 0 ? Math.max(1, Math.floor(requestedSize)) : 6;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.max(1, Math.min(pageCount, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1));
  const offset = (page - 1) * pageSize;
  return { items: items.slice(offset, offset + pageSize), page, pageSize, pageCount, total: items.length, from: items.length ? offset + 1 : 0, to: Math.min(items.length, offset + pageSize) };
}

export function dataViewPageNumbers(page: number, pageCount: number): (number | 'gap')[] {
  const pages = Array.from(new Set([1, page - 1, page, page + 1, pageCount])).filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  for (const [index, value] of pages.entries()) {
    if (index && value - pages[index - 1] > 1) result.push('gap');
    result.push(value);
  }
  return result;
}
