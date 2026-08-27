import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { binLabel, histogramBins } from "@/lib/stats";
import BackChip from "@/components/BackChip";

type NormalResponse = {
  samples: number[];
  count: number;
  sample_mean: number;
  sample_std: number;
};

// Bản Next.js đọc NEXT_PUBLIC_API_URL — bản Vite dùng tiền tố riêng VITE_*.
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export default function NormalPage() {
  const [form, setForm] = useState({ mean: "0", std: "1", n: "5000", seed: "" });
  const [result, setResult] = useState<NormalResponse | null>(null);
  const [chartData, setChartData] = useState<{ label: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string | null => {
    if (!Number.isFinite(parseFloat(form.std)) || parseFloat(form.std) <= 0)
      return "σ phải là số dương.";
    const nNum = parseInt(form.n, 10);
    if (!Number.isInteger(nNum) || nNum < 10 || nNum > 10000)
      return "n phải nằm trong khoảng 10 .. 10000.";
    if (form.seed.trim() !== "" && !Number.isInteger(parseInt(form.seed, 10)))
      return "Seed phải là số nguyên (hoặc bỏ trống).";
    if (!Number.isFinite(parseFloat(form.mean))) return "μ không hợp lệ.";
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
      const params: Record<string, number> = {
        mean: parseFloat(form.mean),
        std: parseFloat(form.std),
        n: parseInt(form.n, 10),
      };
      if (form.seed.trim() !== "") params.seed = parseInt(form.seed, 10);

      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ).toString();
      const res = await fetch(`${API_URL}/api/v1/normal?${qs}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { detail?: string }
          | null;
        throw new Error(body?.detail ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as NormalResponse;
      setResult(data);

      // Binning phía client bằng helper dùng chung — biểu đồ 40 bins
      const bins = histogramBins(data.samples, 40);
      setChartData(bins.map((b) => ({ label: binLabel(b), count: b.count })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không gọi được API ở port 8000.");
      setResult(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Lý thuyết: mẫu ~ N(μ, σ²) nên kỳ vọng x̄ ≈ μ và s ≈ σ
  const theory =
    result != null
      ? { mu: parseFloat(form.mean), sigma: parseFloat(form.std) }
      : null;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <BackChip />

      <header>
        <p className="text-sm font-medium text-blue-600">Box-Muller transform</p>
        <h1 className="text-2xl font-bold mt-1">Phân phối chuẩn</h1>
        <p className="text-gray-500 text-sm mt-1">
          Z = √(−2 ln U₁) · cos(2πU₂) — biến đổi hai biến đều thành hai chuẩn tắc độc lập.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {(
          [
            { name: "mean", label: "μ (kỳ vọng)" },
            { name: "std", label: "σ (độ lệch chuẩn)" },
            { name: "n", label: "n (số mẫu, 10..10000)" },
            { name: "seed", label: "seed (tùy chọn)" },
          ] as const
        ).map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="block text-sm font-medium mb-1">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.name === "seed" ? "text" : "number"}
              step="any"
              value={form[f.name]}
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

      {result && theory && (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              n = {result.count}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              x̄ = {result.sample_mean.toFixed(3)} ≈ μ = {theory.mu}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              s = {result.sample_std.toFixed(3)} ≈ σ = {theory.sigma}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold mb-4">Histogram của mẫu mô phỏng</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [value, "Số điểm"]}
                  labelFormatter={(label) => `Tâm bin ≈ ${label}`}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </main>
  );
}
