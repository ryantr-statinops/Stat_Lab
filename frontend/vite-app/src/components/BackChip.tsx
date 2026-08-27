import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/** Chip quay về tổng quan — khối ⓪ của trang trạm (SCREENS.md §3). */
export default function BackChip({ to = "/", label = "Tổng quan" }: { to?: string; label?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-medium text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
    >
      <ArrowLeft size={12} strokeWidth={2} aria-hidden />
      {label}
    </Link>
  );
}
