import CodeBlock from '../../../lib/components/code/CodeBlock';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../lib/components/date-picker/DatePicker";
import {
  parsePickerValue,
  type PickerMode,
} from "../../../lib/components/date-picker/dates";
import Dropdown from "../../../lib/components/Dropdown";
import Switch from "../../../lib/components/Switch";

export default function DatePickerPage() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [mode, setMode] = useState<PickerMode>("day");
  const [variant, setVariant] = useState<"primary" | "secondary">("primary");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [disabled, setDisabled] = useState(false);
  const [includeTime, setIncludeTime] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [values, setValues] = useState<Record<PickerMode, string>>({
    year: "",
    month: "",
    week: "",
    day: "",
    time: "",
  });
  const label = t(`picker${mode[0].toUpperCase()}${mode.slice(1)}`);
  const withTime = mode === "day" && includeTime;
  const value = withTime ? dateTime : values[mode];
  const selected = parsePickerValue(value, mode, withTime);
  const formatDate = (date: Date) =>
    date.toLocaleDateString(i18n.resolvedLanguage ?? "en", {
      dateStyle: "medium",
    });
  const example = `const [value, setValue] = useState('');

<DatePicker
  label="${label}"
  mode="${mode}"
  variant="${variant}"
  size="${size}"
  value={value}
  onChange={setValue}${withTime ? "\n  includeTime" : ""}${disabled ? "\n  disabled" : ""}
/>`;
  const properties = [
    ["mode", '"year" | "month" | "week" | "day" | "time"', '"day"'],
    ["value", mode === "time" ? "string · HH:mm" : "string", "—"],
    ["onChange", "(value: string) => void", "—"],
    ["label", "string", "—"],
    ["variant", '"primary" | "secondary"', '"primary"'],
    ["size", '"sm" | "md" | "lg"', '"md"'],
    ["disabled", "boolean", "false"],
    ['includeTime (mode="day")', "boolean · YYYY-MM-DDTHH:mm", "false"],
    ["required", "boolean", "false"],
    ["min / max", "string", "—"],
    ["id / name", "string", "—"],
    ["minYear / maxYear", "number", "1900 / 2100"],
  ];

  return (
    <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
      <div className="mb-5 font-mono text-[11px] text-site-muted">
        {t("componentCrumb")}
        {t("datePicker")}
      </div>
      <div className="component-heading">
        <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl">
          {t("datePicker")}
        </h1>
        <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
          Day.js
        </span>
      </div>
      <p className="max-w-[600px] text-[13px] text-site-muted">
        {t("pickerIntro")}
      </p>
      <div className="mt-[26px] overflow-hidden rounded-[11px] border border-site-border shadow-[0_12px_45px_var(--site-shadow-soft)]">
        <div
          role="group"
          aria-label={t("componentExample")}
          className="flex gap-[22px] border-b border-site-border bg-site-panel px-[18px]"
        >
          {(["preview", "code"] as const).map((item) => (
            <button
              key={item}
              type="button"
              data-selected={tab === item}
              aria-pressed={tab === item}
              onClick={() => setTab(item)}
              className="cursor-pointer border-0 border-b-2 border-transparent bg-transparent py-[13px] text-xs text-site-muted data-[selected=true]:border-site-accent data-[selected=true]:text-site-ink"
            >
              {t(item)}
            </button>
          ))}
        </div>
        <div className="flex min-h-[210px] items-center justify-center bg-site-bg bg-[radial-gradient(ellipse_at_50%_60%,var(--site-soft),transparent_65%),radial-gradient(var(--site-border)_1px,transparent_1px)] bg-size-[auto,18px_18px] px-5 py-11 max-[581px]:px-4">
          {tab === "code" ?
            <CodeBlock code={example} className="w-full text-xs leading-[1.8] whitespace-pre-wrap [overflow-wrap:anywhere]" />
          : <DatePicker
              key={`${mode}-${withTime}`}
              id="date-picker-demo"
              label={label}
              mode={mode}
              includeTime={withTime}
              value={value}
              onChange={(next) =>
                withTime ?
                  setDateTime(next)
                : setValues((previous) => ({ ...previous, [mode]: next }))
              }
              variant={variant}
              size={size}
              disabled={disabled}
            />
          }
        </div>
        <div className="component-controls">
          <div className="component-control">
            <label htmlFor="picker-mode" className="component-control-label">
              {t("pickerMode")}
            </label>
            <Dropdown
              id="picker-mode"
              label={t("pickerMode")}
              value={mode}
              onChange={setMode}
              options={(["year", "month", "week", "day", "time"] as const).map(
                (item) => ({
                  value: item,
                  label: t(`picker${item[0].toUpperCase()}${item.slice(1)}`),
                }),
              )}
            />
          </div>
          <div className="component-control">
            <label htmlFor="picker-variant" className="component-control-label">
              {t("variant")}
            </label>
            <Dropdown
              id="picker-variant"
              label={t("variant")}
              value={variant}
              onChange={setVariant}
              options={[
                { value: "primary", label: t("primary") },
                { value: "secondary", label: t("secondary") },
              ]}
            />
          </div>
          <div className="component-control">
            <label htmlFor="picker-size" className="component-control-label">
              {t("size")}
            </label>
            <Dropdown
              id="picker-size"
              label={t("size")}
              value={size}
              onChange={setSize}
              options={[
                { value: "sm", label: t("small") },
                { value: "md", label: t("medium") },
                { value: "lg", label: t("large") },
              ]}
            />
          </div>
          <div className="component-control">
            <label htmlFor="picker-time" className="component-control-label">
              {t("pickerIncludeTime")}
            </label>
            <div className="component-control-body">
              <Switch
                id="picker-time"
                aria-label={t("pickerIncludeTime")}
                checked={includeTime}
                disabled={mode !== "day"}
                onCheckedChange={setIncludeTime}
              />
            </div>
          </div>
          <div className="component-control component-control--disabled">
            <label
              htmlFor="picker-disabled"
              className="component-control-label"
            >
              {t("disabled")}
            </label>
            <div className="component-control-body">
              <Switch
                id="picker-disabled"
                aria-label={t("disabled")}
                checked={disabled}
                onCheckedChange={setDisabled}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        role="status"
        className="mt-3 min-h-[18px] text-[11px] text-site-accent"
      >
        {value && t("inputValue", { value })}
        {mode === "week" && selected && (
          <span>
            {" "}
            · {formatDate(selected.toDate())} –{" "}
            {formatDate(selected.add(6, "day").toDate())}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs text-site-muted">{t("pickerHelp")}</p>
      <h2 className="mt-8 mb-4 text-[21px] font-medium">{t("properties")}</h2>
      <table className="w-full table-fixed border-collapse text-left text-[11px]">
        <thead>
          <tr>
            {["prop", "type", "default"].map((key) => (
              <th
                key={key}
                className="border-b border-site-border px-2 py-[13px] font-normal text-site-muted"
              >
                {t(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {properties.map(([property, type, defaultValue]) => (
            <tr key={property}>
              <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">
                <code className="text-site-accent">{property}</code>
              </td>
              <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">
                {type}
              </td>
              <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">
                {defaultValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
