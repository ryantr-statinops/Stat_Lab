import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistical Computing Lab",
  description: "Lab học thống kê tính toán với giao diện web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
