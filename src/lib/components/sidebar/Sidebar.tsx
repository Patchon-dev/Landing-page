import { useTranslation } from "react-i18next";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./sidebar.css";

const components = [
  { id: "Button", path: "button", label: "button", keywords: "button" },
  { id: "Card", path: "card", label: "card", keywords: "card" },
  { id: "Input", path: "input", label: "input", keywords: "input" },
  { id: "Switch", path: "switch", label: "switch", keywords: "switch toggle interruptor" },
  { id: "Dropdown", path: "dropdown", label: "dropdown", keywords: "dropdown select menu lista seleção" },
  { id: "DatePicker", path: "date-picker", label: "datePicker", keywords: "date picker year month week day calendar data ano mês semana dia" },
  { id: "Forms", path: "forms", label: "forms", keywords: "forms form formik yup formulário validação" },
  { id: "Toast", path: "toast", label: "toasters", keywords: "toast" },
  { id: "Modal", path: "modal", label: "modals", keywords: "modal dialog modais janela" },
  { id: "DataView", path: "data-view", label: "dataView", keywords: "data-view data view table cards users tabela cartões utilizadores" },
  { id: "Charts", path: "charts", label: "charts", keywords: "charts chart line doughnut gráficos grafico" },
  { id: "Scheduler", path: "scheduler", label: "scheduler", keywords: "scheduler agenda calendar calendário eventos" },
  { id: "Map", path: "map", label: "map", keywords: "map leaflet" },
] as const;

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const currentPath = location.pathname.replace(/\/+$/, "");
  const current = components.find((component) => currentPath === `/components/${component.path}`) ?? components[0];
  const searchTerm = normalize(search.trim());
  const filtered = components.filter((component) => normalize(`${component.keywords} ${t(component.label)}`).includes(searchTerm));

  useEffect(() => {
    if (!expanded) return;
    const links = linksRef.current;
    const selected = links?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!links || !selected) return;
    const listBounds = links.getBoundingClientRect();
    const selectedBounds = selected.getBoundingClientRect();
    if (selectedBounds.top < listBounds.top || selectedBounds.bottom > listBounds.bottom) {
      links.scrollTop += selectedBounds.top - listBounds.top - (links.clientHeight - selectedBounds.height) / 2;
    }
  }, [expanded]);

  function close() {
    setExpanded(false);
    setSearch("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape" || !expanded) return;
    event.preventDefault();
    close();
    triggerRef.current?.focus();
  }

  return (
    <aside className="components-sidebar" data-expanded={expanded} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className="components-sidebar-trigger"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => {
          setSearch("");
          setExpanded((open) => !open);
        }}
      >
        <svg className="components-sidebar-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span className="components-sidebar-selection">
          <span>{t("components")}</span>
          <strong>{t(current.label)}</strong>
        </span>
        <span className="components-sidebar-count" aria-hidden="true">{components.length}</span>
        <svg className="components-sidebar-chevron" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className="components-sidebar-panel" id={panelId}>
        <div className="components-sidebar-search">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
          <input
            type="search"
            placeholder={t("searchComponents")}
            aria-label={t("searchComponents")}
            data-search=""
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="components-sidebar-label">{t("personalLibrary")}</div>
        <nav ref={linksRef} className="components-sidebar-links" aria-label={t("components")}>
          {filtered.map((component) => (
            <NavLink
              key={component.id}
              data-component={component.id}
              to={`/components/${component.path}`}
              className="components-sidebar-link"
              onClick={close}
            >
              {t(component.label)}
            </NavLink>
          ))}
        </nav>
        {filtered.length === 0 && (
          <p data-empty="" className="components-sidebar-empty" role="status">{t("noResults")}</p>
        )}
      </div>
    </aside>
  );
}
