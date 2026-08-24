"use client";

import { useState } from "react";
import axios from "axios";

import BackChip from "@/components/ui/BackChip";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { binLabel, histogramBins } from "@/lib/stats";

type CltResponse = {
  distribution: string;
  n_simulations: number;
  sample_size: number;
  sample_means: number[];
  empirical_mean: number;
  empirical_std: number;
  theoretical_mean: number;
  theoretical_se: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CltPage() {
  const [form, setForm] = useState({
    distribution: "uniform",
    nSimulations: "2000",
    sampleSize: "30",
    seed: "",
  });
  const [result, setResult] = useState<CltResponse | null>(null);
  const [chartData, setChartData] = useState<
    { label: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string | null => {
    const sims = parseInt(form.nSimulations, 10);
    if (!Number.isInteger(sims) || sims < 10 || sims > 20000)
      return "Số lần mô phỏng phải trong khoảng 10 .. 20000.";
    const size = parseInt(form.sampleSize, 10);
    if (!Number.isInteger(size) || size < 2 || size > 10000)
      return "Kích thước mẫu phải trong khoảng 2 .. 10000.";
    if (
      form.seed.trim() !== "" &&
      !Number.isInteger(parseInt(form.seed, 10))
    )
      return "Seed phải là số nguyên (hoặc bỏ trống).";
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
        n_simulations: parseInt(form.nSimulations, 10),
        sample_size: parseInt(form.sampleSize, 10),
        distribution: form.distribution,
      };
      if (form.seed.trim() !== "") params.seed = parseInt(form.seed, 10);

      const res = await axios.get<CltResponse>(`${API_URL}/api/v1/clt`, {
        params,
      });
      setResult(res.data);

      // Phân phối của trung bình mẫu — binning client-side
      const bins = histogramBins(res.data.sample_means, 40);
      setChartData(bins.map((b) => ({ label: binLabel(b), count: b.count })));
    } catch (err) {
      const detail = axios.isAxiosError(err)
        ? err.response?.data?.detail
        : null;
      setError(detail ?? "Không kết nối được API ở port 8000.");
      setResult(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <BackChip />

      <header>
        <p className="text-sm font-medium text-blue-600">
          Central Limit Theorem
        </p>
        <h1 className="text-2xl font-bold mt-1">
          Định lý Giới hạn Trung tâm
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          X̄ → N(μ, σ²/n) — trung bình mẫu tiệm cận chuẩn bất kể phân phối nền.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div>
          <label htmlFor="distribution" className="block text-sm font-medium mb-1">
            Phân phối nền
          </label>
          <select
            id="distribution"
            name="distribution"
            value={form.distribution}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="uniform">Đều [0,1) — μ=0.5, σ²=1/12</option>
            <option value="exponential">Mũ (λ=1) — μ=1, σ²=1</option>
          </select>
        </div>

        {(
          [
            { name: "nSimulations", label: "Số lần mô phỏng (10..20000)" },
            { name: "sampleSize", label: "Kích thước mẫu n (2..10000)" },
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
            {loading ? "Đang mô phỏng..." : "Chạy mô phỏng CLT"}
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
              {result.n_simulations} trung bình mẫu (n={result.sample_size})
            </span>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              x̄ = {result.empirical_mean.toFixed(4)} ≈ μ ={" "}
              {result.theoretical_mean}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full font-medium ${
                Math.abs(result.empirical_std - result.theoretical_se) /
                  result.theoretical_se <
                0.2
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              s = {result.empirical_std.toFixed(4)} vs SE ={" "}
              {result.theoretical_se.toFixed(4)}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold mb-4">
              Phân phối của trung bình mẫu
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [value, "Số mẫu"]}
                  labelFormatter={(label) => `Tâm bin ≈ ${label}`}
                />
                <ReferenceLine
                  x={result.theoretical_mean.toFixed(2)}
                  stroke="#dc2626"
                  strokeDasharray="4 4"
                  label={{ value: "μ lý thuyết", fill: "#dc2626", fontSize: 11 }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 mt-3">
              Đường đỏ đánh dấu kỳ vọng lý thuyết μ. Hãy thử tăng kích thước
              mẫu n và quan sát histogram thu hẹp quanh μ với độ rộng ≈ SE = σ/√n.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
