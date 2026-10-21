import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <main className="px-[6%] py-20">
      <p className="font-mono text-xs text-site-accent">
        {t("notFound")}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{t("missingPage")}</h1>
      <p className="mt-4 text-sm text-site-muted">
        {t("returnIntro")}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-site-fill px-5 py-3 text-sm font-medium text-site-on"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
