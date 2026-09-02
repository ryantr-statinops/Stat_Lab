import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { binLabel, histogramBins } from "@/lib/stats";
import BackChip from "@/components/BackChip";

type TheoryPoint = { x: number; y: number };

type InverseResponse = {
  distribution: string;
  n: number;
  p: number | null;
  lam: number | null;
  sigma: number | null;
  samples: number[];
  count: number;
  sample_mean: number;
  theory: TheoryPoint[];
};

type DistKey = "geometric" | "geometric_general" | "exponential" | "rayleigh";

// Bản Next.js đọc NEXT_PUBLIC_API_URL — bản Vite dùng tiền tố riêng VITE_*.
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const DIST_OPTIONS: { value: DistKey; label: string }[] = [
  { value: "geometric", label: "Hình học (công thức đóng)" },
  { value: "geometric_general", label: "Hình học (tổng quát)" },
  { value: "exponential", label: "Mũ (Exponential)" },
  { value: "rayleigh", label: "Rayleigh" },
];

// Kỳ vọng lý thuyết của từng phân phối để so với x̄ thực nghiệm
const EXPECTED: Record<DistKey, (v: number) => string> = {
  geometric: (p) => `1/(1−p) = ${(1 / (1 - p)).toFixed(3)}`,
  geometric_general: (p) => `1/(1−p) = ${(1 / (1 - p)).toFixed(3)}`,
  exponential: (lam) => `1/λ = ${(1 / lam).toFixed(3)}`,
  rayleigh: (sigma) => `σ√(π/2) = ${(sigma * Math.sqrt(Math.PI / 2)).toFixed(3)}`,
};

// Mật độ/giá trị lý thuyết tại điểm x — vẽ đường đỏ phủ lên histogram
function theoryAt(dist: DistKey, v: number, x: number): number {
  if (dist === "exponential") return v * Math.exp(-v * x);
  if (dist === "rayleigh")
    return (x / (v * v)) * Math.exp(-(x * x) / (2 * v * v));
  // geometric: pmf rời rạc P(X=k) = (1−p)·p^(k−1), k = 1, 2, ...
  const k = Math.round(x);
  return k >= 1 ? (1 - v) * Math.pow(v, k - 1) : 0;
}

export default function InversePage() {
  const [dist, setDist] = useState<DistKey>("geometric");
  const [form, setForm] = useState({
    p: "0.3",
    lambda: "3",
    sigma: "2",
    n: "5000",
    seed: "",
  });
  const [result, setResult] = useState<InverseResponse | null>(null);
  const [chartData, setChartData] = useState<
    { label: string; density: number; count: number; theory: number | null }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDiscrete = dist === "geometric" || dist === "geometric_general";
  const paramValue = parseFloat(
    dist === "exponential" ? form.lambda : dist === "rayleigh" ? form.sigma : form.p,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string | null => {
    const nNum = parseInt(form.n, 10);
    if (!Number.isInteger(nNum) || nNum < 10 || nNum > 10000)
      return "n phải nằm trong khoảng 10 .. 10000.";
    if (form.seed.trim() !== "" && !Number.isInteger(parseInt(form.seed, 10)))
      return "Seed phải là số nguyên (hoặc bỏ trống).";
    if (isDiscrete) {
      if (!Number.isFinite(paramValue) || paramValue <= 0 || paramValue >= 1)
        return "p phải nằm trong khoảng (0, 1).";
    } else if (!Number.isFinite(paramValue) || paramValue <= 0) {
      return dist === "exponential"
        ? "λ phải là số dương."
        : "σ phải là số dương.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = validate();
    if (invalid) {
      setError(invalid);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, number | string> = {
        distribution: dist,
        n: parseInt(form.n, 10),
      };
      if (isDiscrete) params.p = paramValue;
      else if (dist === "exponential") params.lambda = paramValue;
      else params.sigma = paramValue;
      if (form.seed.trim() !== "") params.seed = parseInt(form.seed, 10);

      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ).toString();
      const res = await fetch(`${API_URL}/api/v1/inverse?${qs}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { detail?: string }
          | null;
        throw new Error(body?.detail ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as InverseResponse;
      setResult(data);

      // Histogram mật độ phía client + giá trị lý thuyết tại tâm bin
      const bins = histogramBins(data.samples, 40);
      setChartData(
        bins.map((b) => {
          const center = (b.lower + b.upper) / 2;
          const width = Math.max(b.upper - b.lower, 1e-9);
          return {
            label: binLabel(b),
            density: b.count / (data.count * width),
            count: b.count,
            theory: center >= 1 ? theoryAt(dist, paramValue, center) : null,
          };
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không gọi được API ở port 8000.");
      setResult(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const paramLabel =
    dist === "exponential" ? "λ (lambda)" : dist === "rayleigh" ? "σ (sigma)" : "p";
  const expected = EXPECTED[dist](paramValue);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <BackChip />

      <header>
        <p className="text-sm font-medium text-blue-600">
          Inverse transform sampling
        </p>
        <h1 className="text-2xl font-bold mt-1">Biến đổi ngược</h1>
        <p className="text-gray-500 text-sm mt-1">
          X = F⁻¹(U) với U ~ Uniform(0, 1) — mirror từ 4 ví dụ trong
          lab/R/inverse_transform_examples.R.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="md:col-span-4">
          <label htmlFor="dist" className="block text-sm font-medium mb-1">
            Phân phối
          </label>
          <select
            id="dist"
            name="dist"
            value={dist}
            onChange={(e) => {
              setDist(e.target.value as DistKey);
              setResult(null);
              setChartData([]);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            {DIST_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {(isDiscrete
          ? [{ name: "p", label: "p" }]
          : dist === "exponential"
            ? [{ name: "lambda", label: "λ (lambda)" }]
            : [{ name: "sigma", label: "σ (sigma)" }]
        )
          .concat([
            { name: "n", label: "n (số mẫu, 10..10000)" },
            { name: "seed", label: "seed (tùy chọn)" },
          ])
          .map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="block text-sm font-medium mb-1">
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.name === "seed" ? "text" : "number"}
                step="any"
                value={form[f.name as keyof typeof form]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          ))}

        <div className="md:col-span-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang mô phỏng..." : "Lấy mẫu & vẽ histogram"}
          </button>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
          {error}
        </div>
      )}

      {result && (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              n = {result.count}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              x̄ = {result.sample_mean.toFixed(3)} ≈ {paramLabel} → {expected}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold mb-4">
              Histogram của mẫu mô phỏng (mật độ) & đường lý thuyết
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === "number" ? value.toFixed(4) : value,
                    name === "density" ? "Mật độ mô phỏng" : "Lý thuyết",
                  ]}
                  labelFormatter={(label) => `Tâm bin ≈ ${label}`}
                />
                <Legend
                  formatter={(value) =>
                    value === "density" ? "Mô phỏng (hist)" : "Lý thuyết (curve)"
                  }
                />
                <Bar dataKey="density" fill="#93c5fd" radius={[3, 3, 0, 0]} />
                <Line
                  dataKey="theory"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </main>
  );
}