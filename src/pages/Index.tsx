import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import Button from "../lib/components/button/Button";
import CV from "../assets/Daniel Lopes - Resume.pdf";
import ME from "../assets/optimized/profile-60.webp";
import ME2x from "../assets/optimized/profile-120.webp";
import ME3x from "../assets/optimized/profile-180.webp";
import { useTranslation } from "react-i18next";
import CreativeGrid from "../lib/components/CreativeGrid";

const revealClass =
  "motion-safe:data-[reveal=waiting]:opacity-0 motion-safe:data-[reveal=visible]:animate-enter-soft";

export default function Index() {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLElement>(null);
  const [heroStatus] = useState("");
  const [creativeLoading, setCreativeLoading] = useState(true);
  const browserRef = useRef<HTMLDivElement>(null);
  const pointerPressedRef = useRef(false);
  const tiltMediaRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (
      !page ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;

    const targets = page.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          (target as HTMLElement).dataset.reveal = "visible";
          observer.unobserve(target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
    );

    targets.forEach((target) => {
      // Keep content already in view visible; reveal the rest only once.
      if (target.getBoundingClientRect().top < window.innerHeight - 32) return;
      target.dataset.reveal = "waiting";
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
      targets.forEach((target) => {
        target.dataset.reveal = "";
      });
    };
  }, []);
  const resetTilt = useCallback(() => {
    const browser = browserRef.current;
    if (!browser) return;

    // Ao sair do elemento, regressa à posição inicial sem movimento brusco.
    browser.style.transitionDuration = creativeLoading ? "180ms" : "0ms";
    browser.style.removeProperty("--portfolio-rx");
    browser.style.removeProperty("--portfolio-ry");
  }, [creativeLoading]);

  useEffect(() => {
    // Quando o modo criativo é desligado, interrompe imediatamente o tilt.
    if (!creativeLoading) resetTilt();
  }, [creativeLoading, resetTilt]);
  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (min-width: 581px)",
    );
    tiltMediaRef.current = media;
    media.addEventListener("change", resetTilt);
    return () => {
      media.removeEventListener("change", resetTilt);
      tiltMediaRef.current = null;
    };
  }, [resetTilt]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const browser = browserRef.current;
    if (
      !creativeLoading ||
      pointerPressedRef.current ||
      (event.target instanceof Element &&
        event.target.closest("input, label, button, a, select, textarea")) ||
      !tiltMediaRef.current?.matches ||
      !browser ||
      browser.matches(":has(:focus-visible)")
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left) / bounds.width),
    );
    const y = Math.max(
      0,
      Math.min(1, (event.clientY - bounds.top) / bounds.height),
    );
    // Sem o delay da transição durante o movimento: responde logo ao rato.
    browser.style.transitionDuration = "0ms";
    browser.style.setProperty(
      "--portfolio-rx",
      `${(8 - y * 12).toFixed(2)}deg`,
    );
    browser.style.setProperty(
      "--portfolio-ry",
      `${(-12 + x * 16).toFixed(2)}deg`,
    );
  }

  return (
    <main ref={pageRef} data-home-page="">
      <section className="relative isolate grid items-center gap-[26px] px-[6%] pt-9 pb-[30px] bg-[radial-gradient(ellipse_at_90%_65%,var(--site-glow),transparent_55%)] min-[581px]:grid-cols-[1fr_1fr] min-[581px]:gap-[30px] min-[581px]:px-[5%] min-[581px]:pt-[66px] min-[581px]:pb-12 min-[581px]:bg-[radial-gradient(ellipse_at_80%_16%,var(--site-glow),transparent_53%),radial-gradient(ellipse_at_20%_100%,var(--site-soft),transparent_55%)] min-[581px]:max-[761px]:gap-3 min-[581px]:max-[761px]:pt-[42px]">
        <div className="relative z-1">
          <div className="mb-5 inline-flex items-center gap-2 rounded-[30px] border border-site-border bg-site-panel px-3 py-1.5 text-[11px]">
            <span className="size-1.5 rounded-full bg-success-500" />
            {t("available")}
          </div>
          <div className="font-mono text-[11px] tracking-[1.6px] text-site-muted uppercase mb-[14px]">
            {t("heroRole")}
          </div>
          <h1 className="motion-safe:animate-enter-soft mb-[22px] text-[49px] font-semibold leading-[1.02] tracking-[-2.4px] min-[581px]:text-[clamp(42px,5.6vw,68px)] min-[581px]:tracking-[-3px] min-[581px]:max-[761px]:text-[46px] max-[400px]:text-[42px]">
            {t("clearIdeas")}
            <br />
            {t("interfaces")}
            <br />
            <em className="bg-linear-115 from-site-accent from-12% to-site-title-end to-95% bg-clip-text text-transparent not-italic">
              {t("withImpact")}
            </em>
          </h1>
          <p className="motion-safe:animate-enter-soft motion-safe:[animation-delay:80ms] m-0 text-[13px] text-site-muted max-w-[360px]">
            {t("heroIntro")}
          </p>
          <div className="motion-safe:animate-enter-soft motion-safe:[animation-delay:160ms] mt-[26px] flex flex-wrap gap-3">
            <Button
              data-section="dl-work-section"
              variant="primary" size="md"
              to="/#projetos"
            >
              {t("exploreWork")}
              <span>↗</span>
            </Button>
            <Button
              data-library=""
              variant="outline" size="md"
              to="/components/button"
            >
              {t("tryComponents")}
            </Button>
          </div>
          <div className="mt-[25px] text-[11px] text-site-muted">
            {t("location")}
          </div>
        </div>
        <div className="motion-safe:animate-enter-soft motion-safe:[animation-delay:180ms] motion-safe:[animation-duration:800ms] flex justify-end pe-0 md:pe-18">
          <div
            data-art=""
            className="relative z-1 w-full min-w-0 rounded-[18px] px-6 pt-12 pb-4 perspective-[1100px] bg-[radial-gradient(ellipse_at_50%_50%,var(--site-halo),transparent_70%)] max-[581px]:px-2 max-[581px]:pt-[18px]"
            onPointerMove={handlePointerMove}
            onPointerDownCapture={() => {
              pointerPressedRef.current = true;
            }}
            onPointerUpCapture={() => {
              pointerPressedRef.current = false;
            }}
            onPointerCancel={() => {
              pointerPressedRef.current = false;
            }}
            onPointerLeave={() => {
              pointerPressedRef.current = false;
              resetTilt();
            }}
          >
            <CreativeGrid active={creativeLoading} />
            <div
              data-browser=""
              className="relative overflow-hidden rounded-xl border border-site-border bg-site-panel transform-3d shadow-[12px_20px_0_-6px_var(--site-soft),0_35px_70px_var(--site-shadow-browser)] -rotate-z-1 min-[581px]:[--portfolio-rx:5deg] min-[581px]:[--portfolio-ry:-9deg] min-[581px]:rotate-x-(--portfolio-rx) min-[581px]:rotate-y-(--portfolio-ry) min-[581px]:-rotate-z-2 motion-safe:transition-transform motion-safe:duration-180 motion-safe:ease-out min-[581px]:motion-safe:[&:has(:focus-visible)]:rotate-x-0 min-[581px]:motion-safe:[&:has(:focus-visible)]:rotate-y-0 motion-safe:[&:has(:focus-visible)]:rotate-z-0 motion-reduce:transform-none min-[581px]:motion-reduce:transform-none"
              ref={browserRef}
            >
              <div className="flex items-center gap-[5px] border-b border-site-border p-3 text-[10px] text-site-muted">
                <b className="size-[5px] rounded-full bg-site-muted opacity-50" />
                <b className="size-[5px] rounded-full bg-site-muted opacity-50" />
                <b className="size-[5px] rounded-full bg-site-muted opacity-50" />
                <span className="ml-3 font-mono">{t("playground")}</span>
              </div>
              <div className="p-[22px] min-[581px]:max-[761px]:p-[14px] max-[581px]:p-[18px]">
                <div className="mb-4 flex items-center justify-between gap-2 text-[11px] text-site-muted">
                  <strong className="font-medium text-site-ink">
                    {t("applicationSlogan")}
                  </strong>
                  <a
                    href="https://www.linkedin.com/in/danieltlopes97/"
                    target="_blank"
                  >
                    ↗
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-3 max-[400px]:grid-cols-1 min-[581px]:max-[761px]:grid-cols-1 min-[581px]:max-[761px]:gap-1.5">
                  <div className="col-span-2 min-w-0 rounded-[9px] border border-site-border bg-site-bg px-3 py-4 min-[581px]:max-[761px]:px-[7px] min-[581px]:max-[761px]:py-3">
                    <div className="mb-3 flex items-center gap-2 text-[11px]">
                      <span className="shrink-0 rounded-full bg-site-fill p-1 flex items-center justify-center text-[11px] font-semibold text-site-on">
                        <img
                          className="max-w-[60px] object-cover rounded-full"
                          src={ME}
                          srcSet={`${ME} 60w, ${ME2x} 120w, ${ME3x} 180w`}
                          sizes="60px"
                          width={60}
                          height={75}
                          decoding="async"
                          alt="Daniel Lopes"
                        />
                      </span>
                      <span className="min-w-0">
                        Daniel Lopes
                        <small className="block text-[10px] text-site-muted">
                          {t("frontendRole")}
                        </small>
                        <a
                          href="mailto:danieltlopes97@gmail.com"
                          className="block text-[10px] text-site-accent [overflow-wrap:anywhere] hover:underline"
                        >
                          danieltlopes97@gmail.com
                        </a>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                        React
                      </span>
                      <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                        TypeScript
                      </span>
                      <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                        Svelte
                      </span>
                      <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                        Angular
                      </span>
                      <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                        SCSS
                      </span>
                      <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                        Tailwind
                      </span>
                      <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                        Node.js
                      </span>
                      <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                        Rails
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 rounded-[9px] border border-site-border bg-site-bg px-3 py-4 min-[581px]:max-[761px]:px-[7px] min-[581px]:max-[761px]:py-3">
                    <label className="flex items-center gap-2 text-[11px] whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="size-4 accent-site-fill"
                        checked={creativeLoading}
                        onChange={(e) => setCreativeLoading(e.target.checked)}
                      />
                      {t("creativeMode")}
                    </label>
                    <div
                      className={`${creativeLoading ? "motion-safe:animate-pulse" : ""} my-[9px] h-[7px] rounded-[3px] w-[65%] bg-site-fill mt-[18px]`}
                    />
                    <div
                      className={`${creativeLoading ? "motion-safe:animate-pulse" : ""} my-[9px] h-[7px] rounded-[3px] bg-site-border w-[85%]`}
                    />
                    <div
                      className={`${creativeLoading ? "motion-safe:animate-pulse" : ""} my-[9px] h-[7px] rounded-[3px] bg-site-border w-[85%]`}
                    />
                  </div>
                  <div className="min-w-0 rounded-[9px] border border-site-border bg-site-bg px-3 py-4 min-[581px]:max-[761px]:px-[7px] min-[581px]:max-[761px]:py-3">
                    <div className="font-mono tracking-[1.6px] text-site-muted uppercase text-[10px] tracking-normal">
                      {t("goodInterface")}
                    </div>
                    <div className="mt-[5px] text-[23px] tracking-[-1px]">
                      {t("intuitive")}
                      <span className="text-site-accent">.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-[17px] translate-z-[3px] rotate-3">
              <Button variant="gradient">
                &lt;Button data-variant="gradient" /&gt;
              </Button>
            </div>
            <div className="mt-5 flex justify-between gap-3 font-mono text-[10px] text-site-muted">
              <span>{t("designFlow")}</span>
              <span>{t("madeToExplore")}</span>
            </div>
            <div
              data-hero-status=""
              aria-live="polite"
              className="mt-3 min-h-[18px] text-[11px] text-site-accent"
            >
              {heroStatus}
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-[15px] border-y border-site-border px-[5%] py-5">
        <div className="font-mono text-[11px] tracking-[1.6px] text-site-muted uppercase">
          {t("toolbox")}
        </div>
        <span className="text-[13px] font-medium">React</span>
        <span className="text-[13px] font-medium">TypeScript</span>
        <span className="text-[13px] font-medium">Svelte</span>
        <span className="text-[13px] font-medium">Angular</span>
        <span className="text-[13px] font-medium">Ruby on Rails</span>
      </div>
      <section
        className="px-[5%] py-[54px] max-[581px]:px-[6%] max-[581px]:py-9"
        data-section="projetos"
      >
        <div
          data-reveal=""
          className={`${revealClass} mb-[25px] flex items-end justify-between gap-[18px] max-[581px]:flex-col max-[581px]:items-start`}
        >
          <div>
            <div className="font-mono text-[11px] tracking-[1.6px] text-site-muted uppercase">
              {t("featuredWork")}
            </div>
            <h2 className="mt-2.5 text-[32px] font-medium leading-[1.1] tracking-[-1.1px] max-[581px]:text-[28px]">
              {t("workTitle")}
            </h2>
          </div>
          <span className="font-mono text-[11px] tracking-[1.6px] text-site-muted uppercase tracking-normal">
            {t("workNote")}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-[18px] max-[581px]:grid-cols-1">
          <article
            data-reveal=""
            className={`${revealClass} group relative overflow-hidden rounded-xl border border-site-border bg-site-panel motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-240 motion-safe:hover:-translate-y-[5px] motion-safe:hover:border-site-accent motion-safe:hover:shadow-[0_20px_40px_var(--site-shadow-raised)]`}
          >
            <div className="flex h-[190px] items-center justify-center bg-linear-135 from-site-soft to-site-glow p-6">
              <div className="flex h-[140px] w-full overflow-hidden rounded-lg border border-site-border bg-site-panel shadow-[0_18px_30px_var(--site-shadow-button)] [transform:perspective(800px)_rotateX(8deg)_rotateY(-7deg)_rotateZ(-2deg)] motion-safe:transition-transform motion-safe:duration-350 motion-safe:group-hover:[transform:perspective(800px)_rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)] motion-reduce:transform-none">
                <div className="w-1/4 shrink-0 border-r border-site-border p-3 text-[9px] leading-[2.5] text-site-muted">
                  {t("workspace")}
                  <br />
                  {t("overview")}
                  <br />
                  {t("calendar")}
                  <br />
                  {t("team")}
                </div>
                <div className="min-w-0 flex-1 p-4">
                  <span className="text-[11px]">{t("installSchedule")}</span>
                  <div className="my-[9px] h-[7px] rounded-[3px] w-[65%] bg-site-fill" />
                  <div className="mt-3 grid grid-cols-5 gap-[3px]">
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                    <span className="h-[26px] rounded-[3px] bg-site-border nth-[3n]:bg-site-mini-highlight" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-[22px]">
              <div className="font-mono tracking-[1.6px] text-site-muted uppercase mb-[9px] text-[10px] tracking-[1px]">
                {t("webInterfaces")}
              </div>
              <h3 className="mb-[9px] text-lg font-medium tracking-[-.5px]">
                {t("measureInstall")}
              </h3>
              <p className="m-0 text-[13px] text-site-muted mb-[15px]">
                {t("workDescription")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                  SvelteKit
                </span>
                <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                  Rails
                </span>
                <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                  Google Maps
                </span>
              </div>
            </div>
          </article>
          <article
            data-reveal=""
            className={`${revealClass} motion-safe:[animation-delay:80ms] group relative overflow-hidden rounded-xl border border-site-border bg-site-panel motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-240 motion-safe:hover:-translate-y-[5px] motion-safe:hover:border-site-accent motion-safe:hover:shadow-[0_20px_40px_var(--site-shadow-raised)]`}
          >
            <div className="flex h-[190px] items-center justify-center bg-linear-135 from-site-soft to-site-glow p-6 from-site-ink-blue to-site-soft">
              <div className="flex h-[140px] w-full overflow-hidden rounded-lg border border-site-border bg-site-panel shadow-[0_18px_30px_var(--site-shadow-button)] [transform:perspective(800px)_rotateX(8deg)_rotateY(-7deg)_rotateZ(-2deg)] motion-safe:transition-transform motion-safe:duration-350 motion-safe:group-hover:[transform:perspective(800px)_rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)] motion-reduce:transform-none">
                <div className="w-1/4 shrink-0 border-r border-site-border p-3 text-[9px] leading-[2.5] text-site-muted">
                  {t("componentPreview")}
                  <br />
                  {t("button")}
                  <br />
                  {t("input")}
                  <br />
                  {t("card")}
                </div>
                <div className="min-w-0 flex-1 p-4">
                  <span className="text-[11px]">{t("buildGood")}</span>
                  <div className="my-[9px] h-[7px] rounded-[3px] bg-site-border w-3/4" />
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] bg-site-fill text-site-on">
                      {t("primaryAction")}
                    </span>
                    <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
                      {t("secondary")}
                    </span>
                  </div>
                  <div className="my-[9px] h-[7px] rounded-[3px] bg-site-border mt-[19px] w-[90%]" />
                </div>
              </div>
            </div>
            <div className="p-[22px]">
              <div className="font-mono tracking-[1.6px] text-site-muted uppercase mb-[9px] text-[10px] tracking-[1px]">
                {t("libraryStatus")}
              </div>
              <h3 className="mb-[9px] text-lg font-medium tracking-[-.5px]">
                {t("libraryTitle")}
              </h3>
              <p className="m-0 text-[13px] text-site-muted mb-[15px]">
                {t("libraryIntro")}
              </p>
              <Button
                data-library=""
                variant="outline" size="sm"
                to="/components/button"
              >
                {t("openLibrary")}
              </Button>
            </div>
          </article>
        </div>
      </section>
      <section
        data-reveal=""
        className={`${revealClass} px-[5%] py-[54px] max-[581px]:px-[6%] max-[581px]:py-9 grid grid-cols-[.75fr_1.25fr] gap-[55px] border-t border-site-border max-[761px]:gap-[25px] max-[581px]:grid-cols-1`}
        data-section="sobre"
      >
        <div>
          <div className="font-mono text-[11px] tracking-[1.6px] text-site-muted uppercase">
            {t("aboutLabel")}
          </div>
          <h2 className="mt-2.5 text-[32px] font-medium leading-[1.1] tracking-[-1.1px] max-[581px]:text-[28px]">
            {t("detailMatters")}
            <br />
            {t("experienceMatters")}
          </h2>
        </div>
        <div>
          <p className="m-0 text-site-muted text-[15px] leading-[1.8]">
            {t("aboutIntro")}
          </p>
          <p className="m-0 text-site-muted mt-[14px] text-[15px] leading-[1.8]">
            {t("aboutWork")}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-5">
            <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
              {t("portugueseNative")}
            </span>
            <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
              {t("english")}
            </span>
            <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
              {t("spanish")}
            </span>
          </div>
        </div>
      </section>
      <section
        data-reveal=""
        className={`${revealClass} px-[5%] py-[54px] max-[581px]:px-[6%] max-[581px]:py-9 border-t border-site-border`}
        data-section="percurso"
      >
        <div className="mb-[25px] flex items-end justify-between gap-[18px] max-[581px]:flex-col max-[581px]:items-start">
          <div>
            <div className="font-mono text-[11px] tracking-[1.6px] text-site-muted uppercase">
              {t("careerLabel")}
            </div>
            <h2 className="mt-2.5 text-[32px] font-medium leading-[1.1] tracking-[-1.1px] max-[581px]:text-[28px]">
              {t("careerTitle")}
            </h2>
          </div>
          <span className="font-mono text-[11px] tracking-[1.6px] text-site-muted uppercase">
            {t("yearsExperience")}
          </span>
        </div>
        <div className="grid grid-cols-[.7fr_1fr_1.4fr] items-start gap-[22px] border-t border-site-border py-[25px] max-[581px]:grid-cols-1 max-[581px]:gap-2">
          <span className="text-xs text-site-muted">{t("workExperience")}</span>
          <strong className="text-sm font-medium">{t("fullStackRole")}</strong>
          <p className="m-0 text-[13px] text-site-muted">{t("careerIntro")}</p>
        </div>
        <div className="grid grid-cols-[.7fr_1fr_1.4fr] items-start gap-[22px] border-t border-site-border py-[25px] max-[581px]:grid-cols-1 max-[581px]:gap-2">
          <span className="text-xs text-site-muted">{t("education")}</span>
          <strong className="text-sm font-medium">
            {t("techDesign")}
            <br />
            {t("multimedia")}
          </strong>
          <p className="m-0 text-[13px] text-site-muted">{t("degreeIntro")}</p>
        </div>
      </section>
      <section
        data-reveal=""
        className={`${revealClass} relative mx-[5%] mb-[52px] grid grid-cols-[1fr_auto] items-center gap-6 overflow-hidden rounded-[14px] border border-site-border bg-[radial-gradient(ellipse_at_95%_10%,var(--site-glow),transparent_68%),linear-gradient(120deg,var(--site-panel),var(--site-soft))] p-9 max-[581px]:mx-[6%] max-[581px]:mb-9 max-[581px]:grid-cols-1 max-[581px]:p-7`}
      >
        <div>
          <div className="font-mono text-[11px] tracking-[1.6px] uppercase text-site-accent">
            {t("exploreLibrary")}
          </div>
          <h2 className="mt-2.5 text-[32px] font-medium leading-[1.1] tracking-[-1.1px] max-[581px]:text-[28px] mt-2 mb-[14px]">
            {t("dontJustLook")}
            <br />
            {t("giveItTry")}
          </h2>
          <p className="m-0 text-[13px] text-site-muted">{t("exploreIntro")}</p>
        </div>
        <Button
          data-library=""
          variant="primary" size="md"
          to="/components/button"
        >
          {t("openComponents")}
        </Button>
      </section>
      <section
        data-reveal=""
        className={`${revealClass} flex items-center justify-between gap-5 border-t border-site-border px-[5%] py-12 max-[581px]:flex-col max-[581px]:items-start`}
        data-section="contacto"
      >
        <div>
          <div className="font-mono text-[11px] tracking-[1.6px] text-site-muted uppercase">
            {t("contactLabel")}
          </div>
          <h2 className="mt-2.5 font-medium leading-[1.1] tracking-[-1.1px] text-[40px] max-[581px]:text-[34px]">
            {t("nextIdea")}
            <br />
            {t("startsHere")}
          </h2>
          <p className="m-0 text-[13px] text-site-muted mt-4">
            {t("remoteAvailable")}
          </p>
        </div>
        <div>
          <div className="font-mono text-[11px] tracking-[1.6px] text-site-muted uppercase">
            {t("contact")}
          </div>
          <p className="m-0 text-[13px] text-site-muted mt-2.5">
            <a href="mailto:danieltlopes97@gmail.com">{t("email")}</a>{" "}
            <span className="text-white">·</span>{" "}
            <a
              href="https://www.linkedin.com/in/danieltlopes97/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linkedin
            </a>{" "}
            <span className="text-white">·</span>{" "}
            <a href={CV} target="_blank" rel="noopener noreferrer">
              {t("resumePdf")}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
