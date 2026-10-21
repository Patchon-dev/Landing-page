import CodeBlock from '../../../lib/components/code/CodeBlock';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../lib/components/modal/Modal";
import Dropdown from "../../../lib/components/Dropdown";
import Input from "../../../lib/components/input/Input";
import Textarea from "../../../lib/components/input/Textarea";
import Switch from "../../../lib/components/Switch";

function ProfileFields({ longContent }: { longContent: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="modal-demo-fields">
      <label className="modal-demo-field">
        {t("name")}
        <Input
          name="name"
          defaultValue="Daniel Matos"
          autoComplete="name"
          required
        />
      </label>
      <label className="modal-demo-field">
        {t("modalEmail")}
        <Input
          name="email"
          type="email"
          defaultValue="daniel@example.com"
          autoComplete="email"
          required
        />
      </label>
      <label className="modal-demo-field">
        {t("modalMessage")}
        <Textarea name="message" placeholder={t("modalMessagePlaceholder")} />
      </label>
      {longContent &&
        Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="text-site-muted">
            {t("modalLongParagraph")}
          </p>
        ))}
    </div>
  );
}

export default function ModalPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [variant, setVariant] = useState<"primary" | "secondary">("primary");
  const [longContent, setLongContent] = useState(false);
  const [status, setStatus] = useState("");
  const example = `const [open, setOpen] = useState(false);

function ProfileFields() {
  return (
    <div className="modal-demo-fields">
      <label className="modal-demo-field">
        ${t("name")}
        <Input name="name" defaultValue="Daniel Matos" autoComplete="name" required />
      </label>
      <label className="modal-demo-field">
        ${t("modalEmail")}
        <Input name="email" type="email" defaultValue="daniel@example.com" autoComplete="email" required />
      </label>
      <label className="modal-demo-field">
        ${t("modalMessage")}
        <Textarea name="message" placeholder="${t("modalMessagePlaceholder")}" />
      </label>
    </div>
  );
}

<button type="button" onClick={() => setOpen(true)}>
  ${t("modalOpen")}
</button>

<Modal
  open={open}
  onOpenChange={setOpen}
  title="${t("modalDemoTitle")}"
  size="${size}"
  variant="${variant}"
  onSuccess={(formData) => {
    console.log(formData.get('name'));
    console.log(formData.get('email'));
    console.log(formData.get('message'));
  }}
  onCancel={() => console.log(${JSON.stringify(t("modalCancelled"))})}
>
  <ProfileFields />
</Modal>`;
  const properties = [
    ["open", "boolean", "—"],
    ["onOpenChange", "(open: boolean) => void", "—"],
    ["title", "string", "—"],
    ["description", "string", "—"],
    ["children", "ReactNode", "—"],
    ["onSuccess", "(data: FormData) => void | Promise<void>", "—"],
    ["onCancel", "() => void", "—"],
    ["size", '"sm" | "md" | "lg"', '"md"'],
    ["variant", '"primary" | "secondary"', '"primary"'],
    [
      "submitLabel / cancelLabel",
      "string",
      `${t("modalConfirm")} / ${t("cancel")}`,
    ],
  ];

  return (
    <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
      <div className="mb-5 font-mono text-[11px] text-site-muted">
        {t("componentCrumb")}
        {t("modals")}
      </div>
      <div className="component-heading">
        <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl">
          {t("modals")}
        </h1>
        <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
          {t("demo")}
        </span>
      </div>
      <p className="max-w-[600px] text-[13px] text-site-muted">
        {t("modalIntro")}
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
          : <button
              type="button"
              className="site-button"
              data-variant={variant}
              onClick={() => {
                setStatus("");
                setOpen(true);
              }}
            >
              {t("modalOpen")} <span aria-hidden="true">↗</span>
            </button>
          }
        </div>
        <div className="component-controls">
          <div className="component-control">
            <label htmlFor="modal-size" className="component-control-label">
              {t("size")}
            </label>
            <Dropdown
              id="modal-size"
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
            <label htmlFor="modal-variant" className="component-control-label">
              {t("variant")}
            </label>
            <Dropdown
              id="modal-variant"
              label={t("variant")}
              value={variant}
              onChange={setVariant}
              options={[
                { value: "primary", label: t("primary") },
                { value: "secondary", label: t("secondary") },
              ]}
            />
          </div>
          <div className="component-control component-control--wide">
            <label
              htmlFor="modal-long-content"
              className="component-control-label"
            >
              {t("modalLongContent")}
            </label>
            <div className="component-control-body">
              <Switch
                id="modal-long-content"
                aria-label={t("modalLongContent")}
                checked={longContent}
                onCheckedChange={setLongContent}
              />
            </div>
          </div>
        </div>
      </div>
      <p
        role="status"
        className="mt-3 min-h-[18px] text-[11px] text-site-accent"
      >
        {status}
      </p>
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
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={t("modalDemoTitle")}
        description={t("modalDemoDescription")}
        size={size}
        variant={variant}
        onSuccess={async (data) => {
          await new Promise<void>((resolve) => window.setTimeout(resolve, 500));
          setStatus(t("modalSaved", { name: String(data.get("name") ?? "") }));
        }}
        onCancel={() => setStatus(t("modalCancelled"))}
      >
        <ProfileFields longContent={longContent} />
      </Modal>
    </main>
  );
}
