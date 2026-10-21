import { useTranslation } from "react-i18next";
import InteractiveMap from "../../../lib/components/map/InteractiveMap";

export default function MapPage() {
  const { t } = useTranslation();
  return (
    <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
      <div className="mb-5 font-mono text-[11px] text-site-muted">
        {t("componentCrumb")}
        {t("map")}
      </div>
      <div className="component-heading">
        <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl">
          {t("map")}
        </h1>
        <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
          Leaflet
        </span>
      </div>
      <p className="max-w-[600px] text-[13px] text-site-muted">
        {t("mapIntro")}
      </p>
      <section
        className="mt-[26px] overflow-hidden rounded-[11px] border border-site-border shadow-[0_12px_45px_var(--site-shadow-soft)]"
        aria-label={t("preview")}
      >
        <InteractiveMap />
      </section>
      <p className="mt-4 text-xs text-site-muted">{t("mapHelp")}</p>
    </main>
  );
}
