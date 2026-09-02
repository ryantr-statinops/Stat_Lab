"use client";

import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const FEATURES = [
  { href: "/lcg", label: "LCG" },
  { href: "/normal", label: "Chuẩn" },
  { href: "/clt", label: "CLT" },
  { href: "/inverse", label: "Biến đổi ngược" },
];

const linkBase = "px-3 py-1.5 rounded-md transition-colors";

/** Navbar bản Vite — dùng NavLink tự highlight active, gom trạm vào dropdown "Feature". */
export default function SiteNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Đóng khi chuyển trang
  useEffect(() => setOpen(false), [location.pathname]);

  const featureActive = FEATURES.some((f) => f.href === location.pathname);

  const overviewCls = ({ isActive }: { isActive: boolean }) =>
    `${linkBase} ${isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`;

  const btnCls = `${linkBase} inline-flex items-center gap-1 ${
    featureActive || open
      ? "bg-blue-50 text-blue-700 font-medium"
      : "text-gray-600 hover:bg-gray-100"
  }`;

  return (
    <nav className="flex items-center gap-1 text-sm">
      <NavLink to="/" end className={overviewCls}>
        Tổng quan
      </NavLink>

      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={btnCls}
        >
          Feature
          <ChevronDown
            size={14}
            aria-hidden
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-md py-1 z-20"
          >
            {FEATURES.map((f) => (
              <NavLink
                key={f.href}
                to={f.href}
                role="menuitem"
                className={`block px-3 py-2 transition-colors ${
                  location.pathname === f.href
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                {f.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
