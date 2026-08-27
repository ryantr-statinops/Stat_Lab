import { Link } from "react-router-dom";

type Topic = {
  href?: string;
  title: string;
  desc: string;
  formula: string;
};

const TOPICS: Topic[] = [
  {
    href: "/lcg",
    title: "LCG",
    desc: "Sinh dãy số giả ngẫu nhiên và phân tích chu kỳ thực tế theo Hull-Dobell.",
    formula: "X[i] = (a·X[i−1] + c) mod m",
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
          Bản Vite (React SPA thuần) — đối chiếu song song với bản Next.js.
          Các hàm thống kê port từ sổ tay{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded">lab/R/</code>.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6">
        {TOPICS.map((topic) =>
          topic.href ? (
            <Link
              key={topic.title}
              to={topic.href}
              className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h2 className="font-bold group-hover:text-blue-600 transition-colors mb-3">
                {topic.title}
              </h2>
              <p className="text-sm text-gray-500 flex-1">{topic.desc}</p>
              <code className="mt-4 text-xs bg-gray-50 border border-gray-100 rounded-md px-2 py-1.5 self-start">
                {topic.formula}
              </code>
            </Link>
          ) : null,
        )}
      </section>
    </main>
  );
}
