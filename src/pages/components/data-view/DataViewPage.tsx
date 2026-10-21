import CodeBlock from '../../../lib/components/code/CodeBlock';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataView, { type DataViewColumn } from '../../../lib/components/data-view/DataView';
import Avatar from '../../../lib/components/Avatar';
import Dropdown from '../../../lib/components/Dropdown';
import Input from '../../../lib/components/input/Input';
import Modal from '../../../lib/components/modal/Modal';
import { sampleUsers, userRoles, userStatuses, userTeams, type DemoUser } from './users';

function EditFields({ user }: { user: DemoUser }) {
  const { t } = useTranslation();
  const id = useId();
  const [role, setRole] = useState(user.role);
  const [team, setTeam] = useState(user.team);
  const [status, setStatus] = useState(user.status);
  return <div className="data-view-edit-fields">
    <div><label htmlFor={`${id}-name`}>{t('name')}</label><Input id={`${id}-name`} name="name" defaultValue={user.name} required maxLength={80} autoComplete="name"
      onInput={(event) => event.currentTarget.setCustomValidity(event.currentTarget.value.trim() ? '' : t('dataViewNameRequired'))} /></div>
    <div><label htmlFor={`${id}-email`}>{t('email')}</label><Input id={`${id}-email`} name="email" type="email" defaultValue={user.email} required maxLength={120} autoComplete="email" /></div>
    <div><label htmlFor={`${id}-role`}>{t('dataViewRole')}</label><Dropdown id={`${id}-role`} name="role" label={t('dataViewRole')} value={role} onChange={setRole} className="site-input site-text-field"
      options={userRoles.map((value) => ({ value, label: t(`dataViewRole_${value}`) }))} /></div>
    <div><label htmlFor={`${id}-team`}>{t('dropdownLabel')}</label><Dropdown id={`${id}-team`} name="team" label={t('dropdownLabel')} value={team} onChange={setTeam} className="site-input site-text-field"
      options={userTeams.map((value) => ({ value, label: t(`dropdownTeam_${value}`) }))} /></div>
    <div><label htmlFor={`${id}-status`}>{t('dataViewStatus')}</label><Dropdown id={`${id}-status`} name="status" label={t('dataViewStatus')} value={status} onChange={setStatus} className="site-input site-text-field"
      options={userStatuses.map((value) => ({ value, label: t(`dataViewStatus_${value}`) }))} /></div>
  </div>;
}

export default function DataViewPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [variant, setVariant] = useState<'table' | 'cards'>('table');
  const [tableVariant, setTableVariant] = useState<'normal' | 'striped'>('normal');
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState<DemoUser[]>(() => sampleUsers.map((user) => ({ ...user })));
  const [dialog, setDialog] = useState<{ type: 'edit' | 'delete'; user: DemoUser } | null>(null);
  const [message, setMessage] = useState('');
  const columns: DataViewColumn<DemoUser>[] = [
    { id: 'name', label: t('name'), render: (user) => <div className="data-view-person"><div aria-hidden="true"><Avatar user={{ name: user.name }} size="sm" bgColor="bg-site-fill" /></div><strong>{user.name}</strong></div> },
    { id: 'email', label: t('email'), render: (user) => <span className="data-view-email">{user.email}</span> },
    { id: 'role', label: t('dataViewRole'), render: (user) => t(`dataViewRole_${user.role}`) },
    { id: 'team', label: t('dropdownLabel'), render: (user) => t(`dropdownTeam_${user.team}`) },
    { id: 'status', label: t('dataViewStatus'), render: (user) => <span className="data-view-status" data-status={user.status}>{t(`dataViewStatus_${user.status}`)}</span> },
  ];
  const filters = [
    { id: 'role', label: t('dataViewRole'), options: userRoles.map((value) => ({ value, label: t(`dataViewRole_${value}`) })), getValue: (user: DemoUser) => user.role },
    { id: 'status', label: t('dataViewStatus'), options: userStatuses.map((value) => ({ value, label: t(`dataViewStatus_${value}`) })), getValue: (user: DemoUser) => user.status },
  ];
  const example = `const [users, setUsers] = useState<User[]>([
  ${JSON.stringify(sampleUsers[0], null, 2).replaceAll('\n', '\n  ')},
  // ...
]);
const [variant, setVariant] = useState<'table' | 'cards'>('${variant}');

const columns = [
  {
    id: 'name', label: ${JSON.stringify(t('name'))},
    render: (user: User) => (
      <div className="data-view-person">
        <Avatar user={{ name: user.name }} size="sm" />
        <strong>{user.name}</strong>
      </div>
    ),
  },
  { id: 'email', label: 'Email', render: (user: User) => user.email },
  { id: 'role', label: ${JSON.stringify(t('dataViewRole'))}, render: (user: User) => user.role },
  { id: 'team', label: ${JSON.stringify(t('dropdownLabel'))}, render: (user: User) => user.team },
  { id: 'status', label: ${JSON.stringify(t('dataViewStatus'))}, render: (user: User) => user.status },
];

<DataView
  items={users}
  title=${JSON.stringify(t('dataViewUsers'))}
  columns={columns}
  getRowId={(user) => user.id}
  getItemLabel={(user) => user.name}
  getSearchValue={(user) => [user.name, user.email, user.role, user.team, user.status].join(' ')}
  variant={variant}
  onVariantChange={setVariant}
  tableVariant="${tableVariant}"
  pageSize={${pageSize}}
  filters={[
    {
      id: 'role', label: ${JSON.stringify(t('dataViewRole'))},
      options: ${JSON.stringify(filters[0].options)},
      getValue: (user) => user.role,
    },
    {
      id: 'status', label: ${JSON.stringify(t('dataViewStatus'))},
      options: ${JSON.stringify(filters[1].options)},
      getValue: (user) => user.status,
    },
  ]}
  actions={[
    { id: 'edit', label: ${JSON.stringify(t('dataViewEdit'))}, onClick: (user) => console.log(user) },
    { id: 'delete', label: ${JSON.stringify(t('dataViewDelete'))}, tone: 'danger', onClick: (user) => setUsers((previous) => previous.filter((item) => item.id !== user.id)) },
  ]}
/>`;
  const properties = [
    ['items', 'readonly T[]', '—'], ['columns', 'DataViewColumn<T>[]', '—'],
    ['getRowId / getItemLabel / getSearchValue', '(item: T) => string', '—'],
    ['title', 'string', t('dataView')], ['variant', '"table" | "cards"', '"table"'],
    ['onVariantChange', '(variant: "table" | "cards") => void', '—'],
    ['tableVariant', '"normal" | "striped"', '"normal"'], ['pageSize', 'number', '10'],
    ['filters', 'DataViewFilter<T>[]', '[]'], ['actions', 'DataViewAction<T>[]', '[]'],
  ];

  return <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
    <div className="mb-5 font-mono text-[11px] text-site-muted">{t('componentCrumb')}{t('dataView')}</div>
    <div className="component-heading">
      <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl">{t('dataView')}</h1>
      <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">{t('demo')}</span>
    </div>
    <p className="max-w-[650px] text-[13px] text-site-muted">{t('dataViewIntro')}</p>
    <div role="group" aria-label={t('componentExample')} className="mt-[26px] mb-4 flex gap-[22px] border-b border-site-border">
      {(['preview', 'code'] as const).map((item) => <button key={item} type="button" data-selected={tab === item} aria-pressed={tab === item} onClick={() => setTab(item)}
        className="cursor-pointer border-0 border-b-2 border-transparent bg-transparent py-[13px] text-xs text-site-muted data-[selected=true]:border-site-accent data-[selected=true]:text-site-ink">{t(item)}</button>)}
    </div>
    {tab === 'code' ? <CodeBlock code={example} className="rounded-[11px] border border-site-border bg-site-panel p-5 text-xs leading-[1.8] whitespace-pre-wrap [overflow-wrap:anywhere]" />
      : <DataView items={users} columns={columns} title={t('dataViewUsers')} variant={variant} onVariantChange={setVariant} tableVariant={tableVariant} pageSize={pageSize}
        getRowId={(user) => user.id} getItemLabel={(user) => user.name}
        getSearchValue={(user) => [user.name, user.email, user.role, user.team, user.status, t(`dataViewRole_${user.role}`), t(`dropdownTeam_${user.team}`), t(`dataViewStatus_${user.status}`)].join(' ')}
        filters={filters} actions={[
          { id: 'edit', label: t('dataViewEdit'), icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 3 5 5M4 20l4-1 13-13a2.8 2.8 0 0 0-4-4L4 15l-1 6 6-2" /></svg>, onClick: (user) => setDialog({ type: 'edit', user }) },
          { id: 'delete', label: t('dataViewDelete'), tone: 'danger', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></svg>, onClick: (user) => setDialog({ type: 'delete', user }) },
        ]} />}
    <div className="component-controls mt-4 rounded-[11px] border border-site-border">
      <div className="component-control"><label htmlFor="data-view-table-style" className="component-control-label">{t('dataViewTableStyle')}</label>
        <Dropdown id="data-view-table-style" label={t('dataViewTableStyle')} value={tableVariant} onChange={setTableVariant} disabled={variant === 'cards'}
          options={[{ value: 'normal', label: t('dataViewNormal') }, { value: 'striped', label: t('dataViewStriped') }]} /></div>
      <div className="component-control"><label htmlFor="data-view-page-size" className="component-control-label">{t('dataViewPageSize')}</label>
        <Dropdown id="data-view-page-size" label={t('dataViewPageSize')} value={pageSize} onChange={setPageSize} options={[10, 20, 30].map((value) => ({ value, label: String(value) }))} /></div>
    </div>
    <p role="status" className="mt-3 min-h-[18px] text-[11px] text-site-accent">{message}</p>
    <p className="mt-4 text-xs text-site-muted">{t('dataViewPreviewNote')}</p>
    <h2 className="mt-8 mb-4 text-[21px] font-medium">{t('properties')}</h2>
    <table className="w-full table-fixed border-collapse text-left text-[11px]">
      <thead><tr>{['prop', 'type', 'default'].map((key) => <th key={key} className="border-b border-site-border px-2 py-[13px] font-normal text-site-muted">{t(key)}</th>)}</tr></thead>
      <tbody>{properties.map(([property, type, defaultValue]) => <tr key={property}>
        <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]"><code className="text-site-accent whitespace-normal">{property}</code></td>
        <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">{type}</td>
        <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">{defaultValue}</td>
      </tr>)}</tbody>
    </table>
    <Modal open={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }} title={t(dialog?.type === 'delete' ? 'dataViewDeleteUser' : 'dataViewEditUser')}
      submitLabel={t(dialog?.type === 'delete' ? 'dataViewDelete' : 'dataViewSave')} onCancel={() => {}} onSuccess={(data) => {
        if (!dialog) return;
        if (dialog.type === 'delete') {
          setUsers((previous) => previous.filter((user) => user.id !== dialog.user.id));
          setMessage(t('dataViewDeleted', { name: dialog.user.name }));
          return;
        }
        const name = String(data.get('name') ?? '').trim();
        const email = String(data.get('email') ?? '').trim();
        const role = data.get('role') as DemoUser['role'];
        const team = data.get('team') as DemoUser['team'];
        const status = data.get('status') as DemoUser['status'];
        if (!name || !email || !userRoles.includes(role) || !userTeams.includes(team) || !userStatuses.includes(status)) throw new Error('Invalid user');
        setUsers((previous) => previous.map((user) => user.id === dialog.user.id ? { ...user, name, email, role, team, status } : user));
        setMessage(t('dataViewSaved', { name }));
      }}>
      {dialog?.type === 'edit' ? <EditFields user={dialog.user} /> : <p>{t('dataViewDeletePrompt', { name: dialog?.user.name ?? '' })}</p>}
    </Modal>
  </main>;
}
