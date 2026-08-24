# 🧭 EVOLUTION — Nhật ký · Quyết định · Backlog

> Chiều thời gian của UI. **Mọi thay đổi/nhận xét append entry mới nhất lên đầu
> mục tương ứng** — không tạo file .md mới.

Format entry: `- YYYY-MM-DD · LOẠI · nội dung`
Loại: `JOURNAL` (nhận xét khi tự dùng) · `DECISION` (chốt cách làm) ·
`DONE` (đã hoàn thành) · `IDEA` (ý tưởng chưa hẹn ngày)

---

## 📒 Nhật ký & quyết định

- 2026-08-24 · JOURNAL · Gặp 500 trên MỌI trang khi test bằng `next start` dù build báo xanh — nguyên nhân: server zombie từ phiên cũ còn giữ `.next` trong khi build mới ghi đè lên → webpack-runtime mất chunk (`Cannot find module './991.js'`). Bài học: trước `npm run build`, luôn chắc chắn không còn process cũ (kiểm tra `ss -ltnp`); nếu nghi ngờ, `rm -rf .next && npm run build`. Cẩn thận với `pkill -f`: pattern khớp cả cmdline của chính shell mình → dùng mẹo ngoặc vuông (`pkill -f 'nex[t]-server'`)
- 2026-08-24 · JOURNAL · Nhấn vào trang trạm xong không có nút quay về tổng quan — phải bấm logo/nav, mất phương hướng
- 2026-08-24 · DONE · Thêm back-chip "← Tổng quan" đầu cả 3 trang trạm (chọn Link tĩnh phương án A; loại router.back() vì đá người dùng ra khỏi site khi vào thẳng URL)
- 2026-08-24 · DECISION · Stack UI chốt: Next.js 14 App Router + Tailwind CSS v3 +
  Recharts; mọi trang trạm là client component, dashboard là server component
- 2026-08-24 · DONE · Thêm CORS middleware phía backend cho `localhost:3000` /
  `127.0.0.1:3000` — điều kiện bắt buộc để web local gọi được API
- 2026-08-24 · JOURNAL · Tab trình duyệt thiếu favicon → cần `app/icon.svg`
- 2026-08-24 · JOURNAL · Nav header chưa highlight trang đang mở, người dùng mất phương hướng
- 2026-08-24 · JOURNAL · Dãy LCG hiển thị dạng pre-text liền — khó đọc khi n lớn, nên chuyển grid + nút Copy
- 2026-08-24 · JOURNAL · Refresh trang mất toàn bộ tham số form → muốn share kết quả phải chụp màn hình
- 2026-08-24 · JOURNAL · Biểu đồ thiếu tiêu đề trục, người xem mới không hiểu trục X là gì
- 2026-08-24 · DECISION · Hoãn dark mode và nâng cấp Next 16 (xem Tech Debt trong ideation.md) — ưu tiên nội dung thống kê
- 2026-08-24 · DECISION · Không tách component sớm (rule of three) — pseudo-catalog nằm ở COMPONENTS.md

## 📌 Backlog ưu tiên

| Prio | Item | Ghi chú kỹ thuật | Xuất phát từ |
|---|---|---|---|
| 🔴 Cao | Favicon qua `app/icon.svg` | tái dùng `/logo.svg` | JOURNAL favicon |
| 🔴 Cao | Nav active state bằng `usePathname()` | so sánh href, thêm class active | JOURNAL nav |
| 🟠 TB | LCG result → grid + Copy button | `navigator.clipboard.writeText` | JOURNAL dãy khó đọc |
| 🟠 TB | Đồng bộ form ↔ URL search params | `useSearchParams`, share link được | JOURNAL refresh mất tham số |
| 🟠 TB | Tiêu đề trục biểu đồ | XAxis/YAxis label Recharts | JOURNAL trục |
| 🟡 TBC | Dark mode | prefix `dark:` + toggle localStorage | DECISION hoãn |
| 🟡 TBC | Skeleton loading | thay đổi-chữ-nút hiện tại | — |
| 🟡 TBC | A11y: aria-live vùng kết quả, không phụ thuộc màu alone | kiểm tra axe devtools | — |
| 🟢 Thấp | Mini sparkline trên topic card | tái dùng endpoint histogram | IDEA |

## 📜 Quy tắc vận hành

1. Entry mới nhất luôn nằm **trên cùng** trong từng mục
2. Backlog item hoàn thành → xoá khỏi bảng + ghi entry `DONE`
3. Ý tưởng thoáng qua chưa rõ giá trị → ghi `IDEA`, không vào backlog vội
