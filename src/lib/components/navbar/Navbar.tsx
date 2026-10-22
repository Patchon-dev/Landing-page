import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LangPicker from "../LangPicker";
import useMobile from "../../hooks/useMobile";
import "./navbar.css";

type NavbarProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const links = [
  { label: "about", to: "/#sobre", section: "dl-about-section" },
  { label: "projects", to: "/#projetos", section: "dl-work-section" },
  { label: "route", to: "/#percurso", section: "dl-experience-section" },
  { label: "components", to: "/components" },
  { label: "contact", to: "/#contacto", section: "dl-contact-section" },
];

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const elements = [document.documentElement, document.body];
    const previous = elements.map((element) => element.style.overflow);
    elements.forEach((element) => {
      element.style.overflow = "hidden";
    });
    return () =>
      elements.forEach((element, index) => {
        element.style.overflow = previous[index];
      });
  }, [menuOpen]);

  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [isMobile, location.key]);

  function closeMenu() {
    dialogRef.current?.close();
    setMenuOpen(false);
  }

  function openMenu() {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), select:not([disabled])",
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function renderLogo() {
    return (
      <Link
        data-home=""
        aria-label={t("homeLink")}
        className="navbar-logo"
        to="/"
        onClick={closeMenu}
      >
        Daniel<span className="text-site-accent">{` {dev}`}</span>
      </Link>
    );
  }

  function renderLinks() {
    return links.map((link) => (
      <Link
        key={link.label}
        data-section={link.section}
        data-library={link.label === "components" ? "" : undefined}
        data-library-navigation={link.label === "components" ? "" : undefined}
        aria-current={
          (
            link.label === "components" &&
            location.pathname.startsWith("/components")
          ) ?
            "page"
          : undefined
        }
        className="navbar-link"
        to={link.to}
        onClick={closeMenu}
      >
        {t(link.label)}
        {link.label === "components" && <span aria-hidden="true"> ↗&#xFE0E;</span>}
      </Link>
    ));
  }

  function renderThemeButton() {
    return (
      <button
        aria-label={t("toggleTheme")}
        data-theme-toggle=""
        className="navbar-theme"
        type="button"
        aria-pressed={theme === "light"}
        onClick={onToggleTheme}
      >
        <span aria-hidden="true">◐</span> {t("theme")}
      </button>
    );
  }

  return (
    <header className="navbar" data-mobile={isMobile}>
      {renderLogo()}
      <button
        aria-label={t("openMenu")}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-haspopup="dialog"
        data-menu-toggle=""
        className="navbar-menu-toggle"
        type="button"
        onClick={openMenu}
      >
        <svg
          aria-hidden="true"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <nav
        aria-label={t("mainNav")}
        data-links=""
        className="navbar-desktop"
        hidden={isMobile}
      >
        {!isMobile && <LangPicker />}
        {renderLinks()}
        {renderThemeButton()}
      </nav>

      <dialog
        id={menuId}
        ref={dialogRef}
        aria-label={t("mainNav")}
        data-mobile-menu=""
        className="mobile-menu"
        onClose={() => setMenuOpen(false)}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="mobile-menu-inner">
          <div className="mobile-menu-header">
            {renderLogo()}
            <button
              type="button"
              autoFocus
              aria-label={t("closeMenu")}
              data-menu-close=""
              className="navbar-menu-close"
              onClick={closeMenu}
            >
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="m6 6 12 12M6 18 18 6" />
              </svg>
            </button>
          </div>
          <nav className="mobile-menu-links" aria-label={t("mainNav")}>
            {renderLinks()}
          </nav>
          <div className="mobile-menu-settings">
            <div className="mobile-menu-language">
              <span>{t("language")}</span>
              {isMobile && <LangPicker />}
            </div>
            {renderThemeButton()}
          </div>
        </div>
      </dialog>
    </header>
  );
}
