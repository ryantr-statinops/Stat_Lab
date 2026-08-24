import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Statistical Computing Lab",
  description: "Lab học thống kê tính toán với giao diện web",
};

const NAV = [
  { href: "/", label: "Tổng quan" },
  { href: "/lcg", label: "LCG" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased flex flex-col">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <img src="/logo.svg" alt="" className="w-7 h-7 rounded-md" />
              StatLab
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-gray-200 py-4 mt-8">
          <p className="max-w-5xl mx-auto px-4 text-xs text-gray-400">
            Statistical Computing Lab — học thống kê tính toán bằng cách tự tay xây dựng.
          </p>
        </footer>
      </body>
    </html>
  );
}
