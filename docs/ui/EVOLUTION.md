# 🧭 EVOLUTION — Nhật ký · Quyết định · Backlog

> Chiều thời gian của UI. **Mọi thay đổi/nhận xét append entry mới nhất lên đầu
> mục tương ứng** — không tạo file .md mới.

Format entry: `- YYYY-MM-DD · LOẠI · nội dung`
Loại: `JOURNAL` (nhận xét khi tự dùng) · `DECISION` (chốt cách làm) ·
`DONE` (đã hoàn thành) · `IDEA` (ý tưởng chưa hẹn ngày)

---

## 📒 Nhật ký & quyết định

- 2026-08-24 · DONE · Mở rộng CORS backend cho origins của **vite-app**: dev `:5173` + preview production `:4173` (thêm test riêng verify); README/INIT-GUIDE/SCREENS cập nhật mục chạy "frontend thứ hai". Khi có thêm frontend mới: nhớ thêm origin vào `ALLOWED_ORIGINS` ở `backend/fastapi/main.py`

- 2026-08-24 · DONE · **Dual frontend live**: hoàn thành mirror `frontend/vite-app` (React18+TS+Vite, port :5173) với đủ 4 trang Home/LCG/Chuẩn/CLT gọi cùng API :8000 — fetch thuần thay axios, NavLink active thay SiteNav thủ công, env VITE_API_URL thay NEXT_PUBLIC_API_URL. Hai bẫy đã xử lý: quên import Link/unused-import, và **Vite không đọc tsconfig paths** (phải khai resolve.alias trong vite.config)
- 2026-08-24 · JOURNAL · Bug do người dùng phát hiện trên `/lcg`: xoá hết số thì ô tự nhảy về "0" và không thể để trống — nguyên nhân anti-pattern `parseInt(value) || 0` ngay trong onChange của controlled input (NaN bị ép thành 0 rồi React ghi ngược lại; kèm theo không gõ được dấu `-`)
- 2026-08-24 · DONE · Chuyển `/lcg` sang pattern chuỗi-thô như `/normal` & `/clt`: onChange giữ raw text, parse/validate gom vào `buildPayload()` lúc submit — ô rỗng được tôn trọng và nhập số âm trở nên khả thi
- 2026-08-24 · DONE · Navbar mới: gom LCG · Chuẩn · CLT vào dropdown **Feature** (component `SiteNav`) + highlight mục active theo pathname — xoá item 🔴 *nav-active* khỏi backlog
- 2026-08-24 · DONE · Bảng LCG tinh chỉnh layout: 3 cột width đều (`table-fixed`), nội dung căn giữa, thêm đường phân cách dọc `divide-x`
- 2026-08-24 · DONE · `/lcg` thay pre-text bằng bảng `lcg_table` 3 cột; API bổ sung `steps[]` qua service `lcg_steps` (port từ R); repo GitHub đổi tên thành **Stat_Lab** (remote + hướng dẫn clone đã cập nhật)
- 2026-08-24 · DECISION · Lập kênh xác minh cách ly `npm run verify:ui`: build + serve trên `.next-verify` riêng, cổng 3100 — chấm dứt vĩnh viễn xung đột `.next` giữa phiên dev của người dùng và các lần build kiểm chứng tự động
- 2026-08-24 · JOURNAL · Sau khi tách BackChip sang `components/ui/`, chip vỡ layout dù code đúng — nguyên nhân kinh điển: `tailwind.config.js > content` chỉ quét `./app/**` nên class riêng của component không được sinh CSS. Fix: thêm `"./components/**/*.{js,ts,jsx,tsx}"`. **Quy tắc sống còn của Tailwind: tạo thư mục source mới = phải cập nhật content globs**, nếu không class sẽ âm thầm biến mất
- 2026-08-24 · JOURNAL · Lần 2 dính họ lỗi `.next`: `next dev` của người dùng trả 500 toàn trang sau khi production build ghi đè — fix chuẩn vẫn là kill server theo PID cổng + `rm -rf .next`; đã bổ sung hàng troubleshooting tương ứng vào INIT-GUIDE. Bài học vận hành: **tránh chạy `npm run build` khi `npm run dev` đang bật** (hai chế độ dùng chung `.next`)
- 2026-08-24 · DECISION · Chuẩn hoá icon bằng thư viện `lucide-react` (bỏ glyph Unicode `←` vì em-box lệch baseline gây lệch chip) — quy ước ghi ở DESIGN-SYSTEM.md §8
- 2026-08-24 · DONE · Tách component thật đầu tiên `components/ui/BackChip.tsx`; cả 3 trang trạm chuyển sang `<BackChip />` — sửa một chỗ, mọi nơi hưởng
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
