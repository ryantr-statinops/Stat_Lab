import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Chip quay về tổng quan — khối ⓪ trong giải phẫu trang trạm
 * (docs/ui/SCREENS.md §3). Icon dùng stroke=currentColor để
 * tự ăn màu hover của chip.
 */
export default function BackChip({
  href = "/",
  label = "Tổng quan",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-medium text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
    >
      <ArrowLeft size={12} strokeWidth={2} aria-hidden />
      {label}
    </Link>
  );
}
