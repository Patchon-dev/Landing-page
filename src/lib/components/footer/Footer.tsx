import { useTranslation } from "react-i18next";
import { Link, useMatch } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();
  const componentsRoute = useMatch("/components/*");
  return (
    <footer className="flex justify-between gap-4 border-t border-site-border px-[5%] py-5 text-[10px] text-site-muted max-[581px]:flex-wrap">
      {componentsRoute ?
        <>
          <Link
            to="/"
            className="touch-manipulation text-[11px] hover:text-site-accent"
          >
            {t("backPortfolio")}
          </Link>
          <span>{t("componentLibrary")}</span>
        </>
      : <>
          <span>© Daniel Lopes</span>
          <span>{t("footerNote")}</span>
        </>
      }
    </footer>
  );
}
