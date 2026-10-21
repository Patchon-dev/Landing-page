import { useEffect, useRef, useState } from 'react';

const spacing = 30;

export default function CreativeGrid({ active }: { active: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePlayback = () => {
      if (active && !reducedMotion.matches) svg.unpauseAnimations();
      else svg.pauseAnimations();
    };
    updatePlayback();
    reducedMotion.addEventListener('change', updatePlayback);
    return () => reducedMotion.removeEventListener('change', updatePlayback);
  }, [active]);

  const verticalLines = Array.from(
    { length: Math.ceil(size.width / spacing) + 1 },
    (_, index) => `M${index * spacing} 0V${size.height}`,
  ).join(' ');
  const horizontalLines = Array.from(
    { length: Math.ceil(size.height / spacing) + 3 },
    (_, index) => `M0 ${(index - 1) * spacing}H${size.width}`,
  ).join(' ');

  return (
    <div
      data-grid=""
      data-creative={active}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[-10%] top-[28%] bottom-0 -z-1 origin-bottom overflow-hidden [transform:perspective(500px)_rotateX(58deg)] mask-[linear-gradient(transparent,black_45%,transparent)] motion-reduce:hidden"
    >
      <svg ref={svgRef} focusable="false" className="absolute inset-0 size-full overflow-hidden" fill="none" stroke="var(--site-grid)" strokeWidth="0.8" shapeRendering="geometricPrecision">
        <path d={verticalLines} />
        <g data-grid-lines="">
          <path d={horizontalLines} />
          <animateTransform attributeName="transform" type="translate" from="0 0" to={`0 ${spacing}`} dur="8s" repeatCount="indefinite" calcMode="linear" />
        </g>
      </svg>
    </div>
  );
}
