import Link from "next/link";

type Topic = {
  href?: string;
  title: string;
  desc: string;
  formula: string;
  status: "ready" | "soon";
};

const TOPICS: Topic[] = [
  {
    href: "/lcg",
    title: "LCG",
    desc: "Sinh dãy số giả ngẫu nhiên và phân tích chu kỳ thực tế theo Hull-Dobell.",
    formula: "X[i] = (a·X[i−1] + c) mod m",
    status: "ready",
  },
  {
    href: "/normal",
    title: "Phân phối chuẩn",
    desc: "Lấy mẫu biến đổi Box-Muller kèm biểu đồ histogram tương tác.",
    formula: "Z = √(−2 ln U) · cos(2πV)",
    status: "ready",
  },
  {
    href: "/clt",
    title: "CLT",
    desc: "Mô phỏng Định lý Giới hạn Trung tâm trên các phân phối nền khác nhau.",
    formula: "X̄ → N(μ, σ²/n)",
    status: "ready",
  },
  {
    href: "/inverse",
    title: "Biến đổi ngược",
    desc: "Lấy mẫu Hình học, Mũ, Rayleigh theo phép biến đổi ngược — mirror từ lab/R.",
    formula: "X = F⁻¹(U)",
    status: "ready",
  },
];

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <section className="pt-10 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Statistical Computing Lab
        </h1>
        <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
          Các hàm thống kê tính toán được port từ sổ tay R trong{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded">lab/R/</code> thành
          API Python (FastAPI) và giao diện web trực quan.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
        {TOPICS.map((topic) =>
          topic.status === "ready" && topic.href ? (
            <Link
              key={topic.title}
              href={topic.href}
              className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold group-hover:text-blue-600 transition-colors">
                  {topic.title}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                  Sẵn sàng
                </span>
              </div>
              <p className="text-sm text-gray-500 flex-1">{topic.desc}</p>
              <code className="mt-4 text-xs bg-gray-50 border border-gray-100 rounded-md px-2 py-1.5 self-start">
                {topic.formula}
              </code>
            </Link>
          ) : (
            <div
              key={topic.title}
              className="flex flex-col bg-white rounded-xl border border-dashed border-gray-200 p-5 opacity-70"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-600">{topic.title}</h2>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                  Stage 3
                </span>
              </div>
              <p className="text-sm text-gray-400 flex-1">{topic.desc}</p>
              <code className="mt-4 text-xs bg-gray-50 border border-gray-100 rounded-md px-2 py-1.5 self-start text-gray-400">
                {topic.formula}
              </code>
            </div>
          )
        )}
      </section>
    </main>
  );
}