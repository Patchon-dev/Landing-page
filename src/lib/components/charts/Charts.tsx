import { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

export interface ChartsProps {
  type: 'line' | 'doughnut';
  labels: string[];
  values: number[];
  label: string;
  additionalSeries?: { label: string; values: number[] }[];
  variant?: 'primary' | 'secondary';
  appearance?: 'solid' | 'soft';
}

export default function Charts({ type, labels, values, label, additionalSeries = [], variant = 'primary', appearance = 'solid' }: ChartsProps) {
  const container = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState({ text: '#a6a7b6', grid: '#30313f', reducedMotion: false });
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const style = getComputedStyle(container.current!);
      setTheme({ text: style.getPropertyValue('--site-muted').trim(), grid: style.getPropertyValue('--site-border').trim(), reducedMotion: media.matches });
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    media.addEventListener('change', update);
    return () => { observer.disconnect(); media.removeEventListener('change', update); };
  }, []);
  const colors = variant === 'primary' ? ['#9b8aff', '#6c8bd8', '#4ec9b0', '#e7b96c'] : ['#f08da9', '#e7aa65', '#b5a0ec', '#71b9c8'];
  const soft = appearance === 'soft';
  const series = [{ label, values }, ...additionalSeries];
  const plugins = { legend: { display: type === 'doughnut' || series.length > 1, position: 'bottom' as const, labels: { color: theme.text, usePointStyle: true, padding: 18 } }, tooltip: { enabled: true } };
  return <div ref={container} style={{ position: 'relative', height: 300, width: '100%', minWidth: 0 }}>
    {type === 'line' ? <Line aria-label={label} role="img" data={{ labels, datasets: series.map((item, index) => ({ label: item.label, data: item.values, borderColor: colors[index % colors.length], backgroundColor: `${colors[index % colors.length]}26`, fill: soft, tension: soft ? 0.4 : 0, borderWidth: 2, pointRadius: 4, pointHoverRadius: 6 })) }} options={{ responsive: true, maintainAspectRatio: false, animation: theme.reducedMotion ? false : { duration: 300 }, plugins, scales: { x: { grid: { display: false }, ticks: { color: theme.text } }, y: { beginAtZero: true, grid: { color: theme.grid }, ticks: { color: theme.text } } } }} />
      : <Doughnut aria-label={label} role="img" data={{ labels, datasets: [{ label, data: values, backgroundColor: colors.map(color => soft ? `${color}99` : color), borderWidth: 0, borderRadius: soft ? 8 : 0, spacing: soft ? 5 : 0, hoverOffset: 6 }] }} options={{ responsive: true, maintainAspectRatio: false, animation: theme.reducedMotion ? false : { duration: 300 }, cutout: soft ? '75%' : '60%', plugins }} />}
    <span className="sr-only">{(type === 'line' ? series : [{ label, values }]).map(item => `${item.label}: ${labels.map((name, index) => `${name}: ${item.values[index]}`).join('; ')}`).join('. ')}</span>
  </div>;
}
