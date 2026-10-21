import { useId, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import Input from '../input/Input';
import { dataViewPageNumbers, filterDataViewItems, paginateDataViewItems, type DataViewFilter } from './data';
import './data-view.css';

export interface DataViewColumn<T> {
  id: string;
  label: string;
  render: (item: T) => ReactNode;
}

export interface DataViewAction<T> {
  id: string;
  label: string;
  icon?: ReactNode;
  tone?: 'default' | 'danger';
  onClick: (item: T) => void;
}

export interface DataViewProps<T> {
  items: readonly T[];
  columns: readonly DataViewColumn<T>[];
  getRowId: (item: T) => string;
  getItemLabel: (item: T) => string;
  getSearchValue: (item: T) => string;
  title?: string;
  variant?: 'table' | 'cards';
  onVariantChange?: (variant: 'table' | 'cards') => void;
  tableVariant?: 'normal' | 'striped';
  filters?: readonly DataViewFilter<T>[];
  actions?: readonly DataViewAction<T>[];
  pageSize?: number;
}

export default function DataView<T>({ items, columns, getRowId, getItemLabel, getSearchValue, title, variant = 'table', onVariantChange, tableVariant = 'normal', filters = [], actions = [], pageSize = 6 }: DataViewProps<T>) {
  const { t } = useTranslation();
  const id = useId();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [requestedPage, setPage] = useState(1);
  const filtered = filterDataViewItems(items, search, getSearchValue, filters, filterValues);
  const pagination = paginateDataViewItems(filtered, requestedPage, pageSize);
  const hasFilters = Boolean(search || Object.values(filterValues).some(Boolean));

  function renderActions(item: T) {
    return <div className="data-view-actions">
      {actions.map((action) => <button key={action.id} type="button" className="data-view-action" data-tone={action.tone ?? 'default'}
        aria-label={`${action.label}: ${getItemLabel(item)}`} title={action.label} onClick={() => action.onClick(item)}>
        {action.icon ?? action.label}
      </button>)}
    </div>;
  }

  return <section className="data-view" aria-label={title ?? t('dataView')} data-view={variant}>
    <header className="data-view-header">
      <div className="data-view-heading"><h2>{title ?? t('dataView')}</h2><span className="data-view-count">{filtered.length}</span></div>
      {onVariantChange && <div className="data-view-switch" role="group" aria-label={t('dataViewLayout')}>
        <button type="button" aria-pressed={variant === 'table'} onClick={() => onVariantChange('table')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M3 15h18M10 4v16" /></svg>{t('dataViewTable')}
        </button>
        <button type="button" aria-pressed={variant === 'cards'} onClick={() => onVariantChange('cards')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>{t('dataViewCards')}
        </button>
      </div>}
    </header>
    <div className="data-view-toolbar">
      <div className="data-view-search">
        <label htmlFor={`${id}-search`}>{t('dataViewSearch')}</label>
        <div className="data-view-search-field">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
          <Input id={`${id}-search`} type="search" value={search} placeholder={t('dataViewSearchPlaceholder')} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        </div>
      </div>
      {filters.map((filter) => <div className="data-view-filter" key={filter.id}>
        <label htmlFor={`${id}-filter-${filter.id}`}>{filter.label}</label>
        <Dropdown id={`${id}-filter-${filter.id}`} label={filter.label} value={filterValues[filter.id] ?? ''} className="site-input site-text-field"
          options={[{ value: '', label: t('dataViewAll') }, ...filter.options]} onChange={(value) => { setFilterValues((previous) => ({ ...previous, [filter.id]: value })); setPage(1); }} />
      </div>)}
      {hasFilters && <button type="button" className="data-view-clear" onClick={() => { setSearch(''); setFilterValues({}); setPage(1); }}>{t('dataViewClear')}</button>}
    </div>
    {pagination.total === 0 ? <div className="data-view-empty"><strong>{t('dataViewEmpty')}</strong><p>{t('dataViewEmptyHelp')}</p></div>
      : variant === 'table' ? <div className="data-view-table-wrap" role="region" aria-label={t('dataViewTableRegion')} tabIndex={0}>
        <table className="data-view-table" data-variant={tableVariant}>
          <caption className="sr-only">{title ?? t('dataView')}</caption>
          <thead><tr>{columns.map((column) => <th scope="col" key={column.id}>{column.label}</th>)}{actions.length > 0 && <th scope="col" className="data-view-actions-cell">{t('dataViewActions')}</th>}</tr></thead>
          <tbody>{pagination.items.map((item) => <tr key={getRowId(item)}>
            {columns.map((column, index) => index === 0 ? <th scope="row" key={column.id}>{column.render(item)}</th> : <td key={column.id}>{column.render(item)}</td>)}
            {actions.length > 0 && <td className="data-view-actions-cell">{renderActions(item)}</td>}
          </tr>)}</tbody>
        </table>
      </div>
        : <ul className="data-view-cards">
          {pagination.items.map((item) => <li key={getRowId(item)}><article className="data-view-card">
            <header>{columns[0]?.render(item)}</header>
            <dl>{columns.slice(1).map((column) => <div key={column.id}><dt>{column.label}</dt><dd>{column.render(item)}</dd></div>)}</dl>
            {actions.length > 0 && <footer>{renderActions(item)}</footer>}
          </article></li>)}
        </ul>}
    <footer className="data-view-footer">
      <p role="status" aria-atomic="true">{t('dataViewRange', { from: pagination.from, to: pagination.to, total: pagination.total })}</p>
      <nav className="data-view-pagination" aria-label={t('dataViewPagination')}>
        <button type="button" aria-label={t('dataViewPrevious')} disabled={pagination.page === 1} onClick={() => setPage(pagination.page - 1)}>‹</button>
        {dataViewPageNumbers(pagination.page, pagination.pageCount).map((page, index) => page === 'gap' ? <span key={`gap-${index}`} aria-hidden="true">…</span>
          : <button key={page} type="button" aria-label={t('dataViewGoToPage', { page })} aria-current={pagination.page === page ? 'page' : undefined} onClick={() => setPage(page)}>{page}</button>)}
        <button type="button" aria-label={t('dataViewNext')} disabled={pagination.page === pagination.pageCount} onClick={() => setPage(pagination.page + 1)}>›</button>
      </nav>
    </footer>
  </section>;
}
