'use client';

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, Filler
);

const DEFAULT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: { family: 'Inter, sans-serif', size: 12 },
        color: '#94a3b8', // slate-400
        boxWidth: 12,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 15, 26, 0.95)',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      padding: 12,
      borderColor: 'rgba(249,115,22,0.3)', // orange-500
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(148,163,184,0.08)' },
      ticks: { color: '#94a3b8', font: { family: 'Inter, sans-serif', size: 11 } },
    },
    y: {
      grid: { color: 'rgba(148,163,184,0.08)' },
      ticks: { color: '#94a3b8', font: { family: 'Inter, sans-serif', size: 11 } },
    },
  },
};

// ─── Line Chart ───────────────────────────────────────────────────────────────
interface LineChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color?: string }[];
  height?: number;
  title?: string;
}

export function LineChart({ labels, datasets, height = 250, title }: LineChartProps) {
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color || colors[i % colors.length],
      backgroundColor: `${ds.color || colors[i % colors.length]}18`,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2.5,
    })),
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={{ ...DEFAULT_OPTIONS, plugins: { ...DEFAULT_OPTIONS.plugins, title: title ? { display: true, text: title } : undefined } } as never} />
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
interface BarChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color?: string }[];
  height?: number;
  horizontal?: boolean;
}

export function BarChart({ labels, datasets, height = 250, horizontal = false }: BarChartProps) {
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: (ds.color || colors[i % colors.length]) + 'CC',
      borderColor: ds.color || colors[i % colors.length],
      borderWidth: 0,
      borderRadius: 6,
    })),
  };

  const options = {
    ...DEFAULT_OPTIONS,
    indexAxis: horizontal ? 'y' as const : 'x' as const,
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={options as never} />
    </div>
  );
}

// ─── Pie Chart ────────────────────────────────────────────────────────────────
interface PieChartProps {
  labels: string[];
  data: number[];
  colors?: string[];
  height?: number;
}

export function PieChart({ labels, data, colors, height = 250 }: PieChartProps) {
  const defaultColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: (colors || defaultColors).map(c => c + 'CC'),
      borderColor: colors || defaultColors,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { font: { family: 'Inter' }, color: '#94a3b8', padding: 16 } },
      tooltip: DEFAULT_OPTIONS.plugins.tooltip,
    },
  };

  return (
    <div style={{ height }}>
      <Pie data={chartData} options={options as never} />
    </div>
  );
}

// ─── Doughnut Chart ───────────────────────────────────────────────────────────
export function DoughnutChart({ labels, data, colors, height = 250 }: PieChartProps) {
  const defaultColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: (colors || defaultColors).map(c => c + 'CC'),
      borderColor: colors || defaultColors,
      borderWidth: 2,
      hoverOffset: 8,
      cutout: '70%',
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { font: { family: 'Inter' }, color: '#94a3b8', padding: 16 } },
      tooltip: DEFAULT_OPTIONS.plugins.tooltip,
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options as never} />
    </div>
  );
}
