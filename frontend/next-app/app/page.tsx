"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    X0: 3,
    a: 7,
    n: 20,
    c: 4,
    m: 99
  });
  const [result, setResult] = useState<{ sequence: number[]; count: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/lcg`, {
        params: formData
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Statistical Computing Lab
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Linear Congruential Generator (LCG)</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">
                  {key.toUpperCase()}
                </label>
                <input
                  type="number"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Random Numbers"}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Kết quả</h3>
            <p className="text-gray-600 mb-3">Số lượng sinh ra: {result.count}</p>
            <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
              <pre className="text-sm break-all">
                {JSON.stringify(result.sequence, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}