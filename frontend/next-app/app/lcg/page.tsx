"use client";

import { useState } from "react";
import axios from "axios";

import BackChip from "@/components/ui/BackChip";

type LcgParams = {
  X0: number;
  a: number;
  n: number;
  c: number;
  m: number;
};

type LcgStep = {
  index: number;
  equation: number;
  xn: number;
};

type LcgResult = {
  sequence: number[];
  count: number;
  theoretical_max_period: number;
  cycle_length: number | null;
  notes: string[];
  steps: LcgStep[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FIELDS: { name: keyof LcgParams; label: string; hint: string }[] = [
  { name: "X0", label: "X0 (seed)", hint: "Giá trị khởi đầu" },
  { name: "a", label: "a (hệ số nhân)", hint: "Multiplier" },
  { name: "n", label: "n (số lượng)", hint: "1 .. 10000" },
  { name: "c", label: "c (hệ số cộng)", hint: "Increment" },
  { name: "m", label: "m (modulo)", hint: "Số nguyên dương" },
];

export default function LcgPage() {
  const [params, setParams] = useState<LcgParams>({ X0: 3, a: 7, n: 20, c: 4, m: 99 });
  const [result, setResult] = useState<LcgResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const validate = (): string | null => {
    for (const key of Object.keys(params) as (keyof LcgParams)[]) {
      if (!Number.isInteger(params[key])) return `${key.toUpperCase()} phải là số nguyên.`;
    }
    if (params.m <= 0) return "m (modulo) phải lớn hơn 0.";
    if (params.n < 1 || params.n > 10000) return "n phải nằm trong khoảng 1 .. 10000.";
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
      const res = await axios.get<LcgResult>(`${API_URL}/api/v1/lcg`, { params });
      setResult(res.data);
    } catch (err) {
      const detail = axios.isAxiosError(err) ? err.response?.data?.detail : null;
      setError(detail ?? "Không kết nối được API. Hãy chắc chắn backend đang chạy ở port 8000.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const fullPeriod =
    result?.cycle_length != null && result.cycle_length === result.theoretical_max_period;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <BackChip />

      <header>
        <p className="text-sm font-medium text-blue-600">Port từ lab/R/LCG.R</p>
        <h1 className="text-2xl font-bold mt-1">Linear Congruential Generator</h1>
        <p className="text-gray-500 text-sm mt-1">
          X[i] = (a · X[i−1] + c) mod m — thuật toán sinh số giả ngẫu nhiên kinh điển.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="block text-sm font-medium mb-1">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type="number"
              value={params[f.name]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">{f.hint}</p>
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang sinh..." : "Sinh dãy số"}
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
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
              {result.count} số được sinh
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                fullPeriod
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              Chu kỳ: {result.cycle_length ?? "?"} / {result.theoretical_max_period}
              {fullPeriod ? " (đầy đủ ✓)" : ""}
            </span>
          </div>

          {result.notes.length > 0 && (
            <ul className="space-y-1">
              {result.notes.map((note, i) => (
                <li
                  key={i}
                  className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2"
                >
                  💡 {note}
                </li>
              ))}
            </ul>
          )}

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="max-h-72 overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-50 text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">n</th>
                    <th className="px-3 py-2 text-right font-medium">a·X(n−1) + c</th>
                    <th className="px-3 py-2 text-right font-medium">Xₙ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {result.steps.map((s) => (
                    <tr key={s.index} className={s.index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-3 py-1.5">{s.index}</td>
                      <td className="px-3 py-1.5 text-right">
                        {s.equation.toLocaleString("vi-VN")}
                      </td>
                      <td className="px-3 py-1.5 text-right font-semibold text-blue-700">
                        {s.xn.toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
