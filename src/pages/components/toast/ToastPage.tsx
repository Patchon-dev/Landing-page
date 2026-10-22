import CodeBlock from '../../../lib/components/code/CodeBlock';
import Dropdown from "../../../lib/components/Dropdown";
import { useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import ToastContent from "../../../lib/components/toast/ToastContent";
import {
  clearToasts,
  getToaster,
  toastTypes,
  type ToastKind,
  type ToastPlacement,
} from "../../../lib/components/toast/toaster";

type PositionSliderProps = {
  id: string;
  label: string;
  options: string[];
  value: number;
  onChange: (value: number) => void;
};

function PositionSlider({
  id,
  label,
  options,
  value,
  onChange,
}: PositionSliderProps) {
  return (
    <div className="component-control component-control--wide">
      <div className="component-control-label">
        <label htmlFor={id}>{label}</label>
        <span
          aria-hidden="true"
          className="rounded-full bg-site-selection px-2 py-0.5 text-[10px] text-site-accent"
        >
          {options[value]}
        </span>
      </div>
      <div className="component-control-body">
        <input
          id={id}
          type="range"
          min={0}
          max={options.length - 1}
          step={1}
          value={value}
          aria-valuetext={options[value]}
          onChange={(event) => onChange(Number(event.target.value))}
          className="toast-position-slider"
          style={
            {
              "--position-progress": `${(value / (options.length - 1)) * 100}%`,
            } as CSSProperties
          }
        />
      </div>
      <div
        aria-hidden="true"
        className="flex justify-between gap-2 text-[10px] text-site-muted"
      >
        {options.map((option, index) => (
          <span
            key={option}
            className={index === value ? "text-site-accent" : ""}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ToastPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [variant, setVariant] = useState<ToastKind>("success");
  const [duration, setDuration] = useState(6000);
  const [vertical, setVertical] = useState<"top" | "bottom">("top");
  const [horizontal, setHorizontal] = useState<"start" | "center" | "end">(
    "end",
  );
  const horizontalOptions = ["start", "center", "end"] as const;
  const placement: ToastPlacement =
    horizontal === "center" ? vertical : `${vertical}-${horizontal}`;
  const positions = {
    "top-start": "toastTopLeft",
    top: "toastTopCenter",
    "top-end": "toastPosition",
    "bottom-start": "toastBottomLeft",
    bottom: "toastBottomCenter",
    "bottom-end": "toastBottomRight",
  } as const;
  const labels = {
    success: "toastSuccess",
    warning: "toastWarning",
    error: "toastError",
    info: "toastInfo",
  } as const;
  const titles = {
    success: "toastSuccessTitle",
    warning: "toastWarningTitle",
    error: "toastErrorTitle",
    info: "toastInfoTitle",
  } as const;
  const descriptions = {
    success: "toastSuccessText",
    warning: "toastWarningText",
    error: "toastErrorText",
    info: "toastInfoText",
  } as const;

  function showToast(type: ToastKind) {
    getToaster(placement)[type]({
      title: t(titles[type]),
      description: t(descriptions[type]),
      duration,
    });
  }

  const example = `getToaster('${placement}').${variant}({\n  title: ${JSON.stringify(t(titles[variant]))},\n  description: ${JSON.stringify(t(descriptions[variant]))},\n  duration: ${duration},\n});`;

  return (
    <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
      <div className="mb-5 font-mono text-[11px] text-site-muted">
        {t("componentCrumb")} <span>{t("toasters")}</span>
      </div>
      <div className="component-heading">
        <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl">
          {t("toasters")}
        </h1>
        <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
          {t("demo")}
        </span>
      </div>
      <p className="m-0 max-w-[540px] text-[13px] text-site-muted">
        {t("toastIntro")}
      </p>

      <div className="mt-[26px] overflow-hidden rounded-[11px] border border-site-border shadow-[0_12px_45px_var(--site-shadow-soft)]">
        <div
          role="group"
          aria-label={t("componentExample")}
          className="flex gap-[22px] border-b border-site-border bg-site-panel px-[18px]"
        >
          {(["preview", "code"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-pressed={tab === value}
              data-selected={tab === value}
              className="cursor-pointer border-0 border-b-2 border-transparent bg-transparent py-[13px] text-xs text-site-muted data-[selected=true]:border-site-accent data-[selected=true]:text-site-ink"
            >
              {t(value)}
            </button>
          ))}
        </div>
        <div className="bg-site-bg bg-[radial-gradient(ellipse_at_65%_35%,var(--site-soft),transparent_70%),radial-gradient(var(--site-border)_1px,transparent_1px)] bg-size-[auto,18px_18px] py-6">
          {tab === "code" ?
            <CodeBlock code={example} className="m-0 min-h-[420px] px-6 py-4 text-xs leading-[1.8] whitespace-pre-wrap [overflow-wrap:anywhere]" />
          : <>
              <div className="mb-6 flex items-center justify-between gap-3 px-5 font-mono text-[10px] text-site-muted">
                <span>{t("toastTypes")}</span>
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">↗&#xFE0E;</span>
                  {t(positions[placement])}
                </span>
              </div>
              <div
                className={`flex w-full max-w-[470px] flex-col gap-4 px-4 ${
                  placement.endsWith("start") ? "mr-auto"
                  : placement.endsWith("end") ? "ml-auto"
                  : "mx-auto"
                }`}
              >
                {toastTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className="site-toast site-toast-preview text-left"
                    data-kind={type}
                    aria-label={t("showToastType", { type: t(labels[type]) })}
                    onClick={() => {
                      setVariant(type);
                      showToast(type);
                    }}
                  >
                    <ToastContent
                      type={type}
                      title={
                        <p className="site-toast-title">{t(titles[type])}</p>
                      }
                      description={
                        <p className="site-toast-description">
                          {t(descriptions[type])}
                        </p>
                      }
                    />
                    <span aria-hidden="true" className="px-1 text-lg">
                      ↗&#xFE0E;
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-6 mb-0 px-5 text-[11px] text-site-muted">
                {t("toastPreviewHint")}
              </p>
            </>
          }
        </div>
        <div className="component-controls">
          <div className="component-control">
            <label className="component-control-label" htmlFor="toast-variant">
              {t("variant")}
            </label>
            <Dropdown
              id="toast-variant"
              label={t("variant")}
              value={variant}
              onChange={setVariant}
              options={toastTypes.map((type) => ({
                value: type,
                label: t(labels[type]),
              }))}
            />
          </div>
          <div className="component-control component-control--compact">
            <label className="component-control-label" htmlFor="toast-duration">
              {t("toastDuration")}
            </label>
            <Dropdown
              id="toast-duration"
              label={t("toastDuration")}
              value={duration}
              onChange={setDuration}
              options={[4000, 6000, 10000].map((value) => ({
                value,
                label: t("toastSeconds", { count: value / 1000 }),
              }))}
            />
          </div>
          <PositionSlider
            id="toast-horizontal"
            label={t("horizontal")}
            options={[t("left"), t("center"), t("right")]}
            value={horizontalOptions.indexOf(horizontal)}
            onChange={(value) => setHorizontal(horizontalOptions[value])}
          />
          <div className="component-control">
            <span id="toast-vertical-label" className="component-control-label">
              {t("vertical")}
            </span>
            <div className="component-control-body">
              <span
                aria-hidden="true"
                className={
                  vertical === "top" ? "text-site-accent" : "text-site-muted"
                }
              >
                {t("top")}
              </span>
              <button
                id="toast-vertical"
                type="button"
                role="switch"
                aria-checked={vertical === "bottom"}
                aria-labelledby="toast-vertical-label"
                aria-describedby="toast-vertical-value"
                onClick={() =>
                  setVertical((value) => (value === "top" ? "bottom" : "top"))
                }
                className="component-toggle"
              >
                <span className="component-toggle-thumb" aria-hidden="true" />
              </button>
              <span
                aria-hidden="true"
                className={
                  vertical === "bottom" ? "text-site-accent" : "text-site-muted"
                }
              >
                {t("bottom")}
              </span>
              <span id="toast-vertical-value" className="sr-only">
                {t(vertical === "top" ? "top" : "bottom")}
              </span>
            </div>
          </div>
          <div className="component-actions">
            <button
              type="button"
              onClick={() => showToast(variant)}
              className="inline-flex items-center gap-2 rounded-lg bg-site-fill px-4 py-2 text-xs font-medium text-site-on motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
            >
              {t("showToast")} <span aria-hidden="true">↗&#xFE0E;</span>
            </button>
            <button
              type="button"
              onClick={clearToasts}
              className="rounded-lg border border-site-border px-3 py-2 text-xs text-site-muted hover:text-site-accent"
            >
              {t("clearToasts")}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-start gap-2 text-[11px] text-site-muted">
        <span aria-hidden="true">◷</span>
        {t("toastPauseHint")}
      </p>

      <h2 className="mt-8 mb-4 text-[21px] font-medium">{t("properties")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[11px] [&_th]:border-b [&_th]:border-site-border [&_th]:px-2 [&_th]:py-[13px] [&_th]:font-normal [&_th]:text-site-muted [&_td]:border-b [&_td]:border-site-border [&_td]:px-2 [&_td]:py-[13px]">
          <thead>
            <tr>
              <th scope="col">{t("prop")}</th>
              <th scope="col">{t("type")}</th>
              <th scope="col">{t("default")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code className="text-site-accent">type</code>
              </td>
              <td>
                <code>success | warning | error | info</code>
              </td>
              <td>
                <code>info</code>
              </td>
            </tr>
            <tr>
              <td>
                <code className="text-site-accent">placement</code>
              </td>
              <td>
                <code>
                  top-start | top | top-end | bottom-start | bottom | bottom-end
                </code>
              </td>
              <td>
                <code>top-end</code>
              </td>
            </tr>
            <tr>
              <td>
                <code className="text-site-accent">title</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>—</td>
            </tr>
            <tr>
              <td>
                <code className="text-site-accent">description</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>—</td>
            </tr>
            <tr>
              <td>
                <code className="text-site-accent">duration</code>
              </td>
              <td>
                <code>number</code>
              </td>
              <td>
                <code>6000 ms</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
