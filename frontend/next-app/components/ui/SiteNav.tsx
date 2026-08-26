"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const FEATURES = [
  { href: "/lcg", label: "LCG" },
  { href: "/normal", label: "Chuẩn" },
  { href: "/clt", label: "CLT" },
];

const linkBase = "px-3 py-1.5 rounded-md transition-colors";

/**
 * Thanh điều hướng chính. Gom các trang trạm vào dropdown "Feature"
 * và highlight mục đang active theo pathname.
 */
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Đóng dropdown mỗi khi chuyển trang
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const featureActive = FEATURES.some((f) => f.href === pathname);

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link
        href="/"
        className={`${linkBase} ${
          pathname === "/"
            ? "bg-blue-50 text-blue-700 font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Tổng quan
      </Link>

      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={`${linkBase} inline-flex items-center gap-1 ${
            featureActive || open
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
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
              <Link
                key={f.href}
                href={f.href}
                role="menuitem"
                className={`block px-3 py-2 transition-colors ${
                  pathname === f.href
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
