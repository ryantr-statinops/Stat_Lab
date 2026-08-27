import { Route, Routes } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import Home from "@/pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/logo.svg" alt="" className="w-7 h-7 rounded-md" />
            StatLab
          </Link>
          <SiteNav />
        </div>
      </header>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>

      <footer className="border-t border-gray-200 py-4 mt-8">
        <p className="max-w-5xl mx-auto px-4 text-xs text-gray-400">
          Statistical Computing Lab — bản Vite (React SPA), đối chiếu với bản Next.js.
        </p>
      </footer>
    </div>
  );
}

