import { useTranslation } from "react-i18next";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const searchTerm = search.trim().toLowerCase();
  return (
    <aside className="border-r border-site-border bg-site-panel px-[18px] py-7 min-[581px]:max-[761px]:px-2.5 min-[581px]:max-[761px]:py-5 max-[581px]:border-r-0 max-[581px]:border-b max-[581px]:px-[6%] max-[581px]:py-[18px]">
      <input
        type="search"
        placeholder={t("searchComponents")}
        aria-label={t("searchComponents")}
        data-search=""
        className="mb-[25px] w-full rounded-[7px] border border-site-border bg-site-bg px-2.5 py-[9px] text-xs text-site-ink max-[581px]:mb-2.5 max-[581px]:text-base"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="font-mono tracking-[1.6px] text-site-muted uppercase mx-2.5 mt-5 mb-2 text-[10px] max-[581px]:hidden">
        {t("personalLibrary")}
      </div>
      <div className="max-[581px]:flex max-[581px]:flex-wrap max-[581px]:gap-1.5">
        {("button".includes(searchTerm) ||
          t("button").toLowerCase().includes(searchTerm)) && (
          <NavLink
            data-component="Button"
            to="/components/button"
            className="cursor-pointer touch-manipulation disabled:cursor-not-allowed disabled:opacity-40 mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("button")}
          </NavLink>
        )}
        {("card".includes(searchTerm) ||
          t("card").toLowerCase().includes(searchTerm)) && (
          <NavLink
            data-component="Card"
            to="/components/card"
            className="cursor-pointer touch-manipulation disabled:cursor-not-allowed disabled:opacity-40 mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("card")}
          </NavLink>
        )}
        {("input".includes(searchTerm) ||
          t("input").toLowerCase().includes(searchTerm)) && (
          <NavLink
            data-component="Input"
            to="/components/input"
            className="cursor-pointer touch-manipulation disabled:cursor-not-allowed disabled:opacity-40 mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("input")}
          </NavLink>
        )}
        {("switch toggle interruptor".includes(searchTerm) ||
          t("switch").toLowerCase().includes(searchTerm)) && (
          <NavLink
            to="/components/switch"
            data-component="Switch"
            className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("switch")}
          </NavLink>
        )}
        {("dropdown select menu lista seleção".includes(searchTerm) ||
          t("dropdown").toLowerCase().includes(searchTerm)) && (
          <NavLink
            to="/components/dropdown"
            data-component="Dropdown"
            className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("dropdown")}
          </NavLink>
        )}
        {("date picker year month week day calendar data ano mês semana dia".includes(
          searchTerm,
        ) ||
          t("datePicker").toLowerCase().includes(searchTerm)) && (
          <NavLink
            to="/components/date-picker"
            data-component="DatePicker"
            className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("datePicker")}
          </NavLink>
        )}
        {("forms form formik yup formulário validação".includes(searchTerm) ||
          t("forms").toLowerCase().includes(searchTerm)) && (
          <NavLink
            to="/components/forms"
            data-component="Forms"
            className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("forms")}
          </NavLink>
        )}
        {("toast".includes(searchTerm) ||
          t("toasters").toLowerCase().includes(searchTerm)) && (
          <NavLink
            data-component="Toast"
            to="/components/toast"
            className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("toasters")}
          </NavLink>
        )}
        {("modal dialog modais janela".includes(searchTerm) ||
          t("modals").toLowerCase().includes(searchTerm)) && (
          <NavLink
            to="/components/modal"
            data-component="Modal"
            className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("modals")}
          </NavLink>
        )}
        {("data-view data view table cards users tabela cartões utilizadores".includes(
          searchTerm,
        ) ||
          t("dataView").toLowerCase().includes(searchTerm)) && (
          <NavLink
            to="/components/data-view"
            data-component="DataView"
            className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("dataView")}
          </NavLink>
        )}
        {('charts chart line doughnut gráficos grafico'.includes(searchTerm) || t('charts').toLowerCase().includes(searchTerm)) && (
          <NavLink to="/components/charts" data-component="Charts" className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3">{t('charts')}</NavLink>
        )}
        {("scheduler agenda calendar calendário eventos".includes(searchTerm) ||
          t("scheduler").toLowerCase().includes(searchTerm)) && (
          <NavLink
            to="/components/scheduler"
            data-component="Scheduler"
            className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("scheduler")}
          </NavLink>
        )}
        {("map leaflet".includes(searchTerm) ||
          t("map").toLowerCase().includes(searchTerm)) && (
          <NavLink
            to="/components/map"
            data-component="Map"
            className="cursor-pointer touch-manipulation mt-0.5 block w-full rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-xs text-site-muted aria-[current=page]:bg-site-selection aria-[current=page]:text-site-accent max-[581px]:w-auto max-[581px]:px-3"
          >
            {t("map")}
          </NavLink>
        )}
      </div>
      {!(
        'charts chart line doughnut gráficos grafico'.includes(searchTerm) || t('charts').toLowerCase().includes(searchTerm) ||
        "forms form formik yup formulário validação".includes(searchTerm) ||
        t("forms").toLowerCase().includes(searchTerm) ||
        "switch toggle interruptor".includes(searchTerm) ||
        t("switch").toLowerCase().includes(searchTerm) ||
        "data-view data view table cards users tabela cartões utilizadores".includes(
          searchTerm,
        ) ||
        t("dataView").toLowerCase().includes(searchTerm) ||
        "dropdown select menu lista seleção".includes(searchTerm) ||
        t("dropdown").toLowerCase().includes(searchTerm) ||
        "scheduler agenda calendar calendário eventos".includes(searchTerm) ||
        t("scheduler").toLowerCase().includes(searchTerm) ||
        "modal dialog modais janela".includes(searchTerm) ||
        t("modals").toLowerCase().includes(searchTerm) ||
        "date picker year month week day calendar data ano mês semana dia".includes(
          searchTerm,
        ) ||
        t("datePicker").toLowerCase().includes(searchTerm) ||
        "map leaflet".includes(searchTerm) ||
        t("map").toLowerCase().includes(searchTerm) ||
        "button".includes(searchTerm) ||
        t("button").toLowerCase().includes(searchTerm) ||
        "input".includes(searchTerm) ||
        t("input").toLowerCase().includes(searchTerm) ||
        "card".includes(searchTerm) ||
        t("card").toLowerCase().includes(searchTerm) ||
        "toast".includes(searchTerm) ||
        t("toasters").toLowerCase().includes(searchTerm)
      ) && (
        <div data-empty="" className="p-2.5 text-[11px] text-site-muted">
          {t("noResults")}
        </div>
      )}
    </aside>
  );
}
