# 🎨 UI Documentation

> Thư mục này là **nguồn chân lý duy nhất** về mặt giao diện của Statistical
> Computing Lab: hệ thống thiết kế, giải phẫu trang, danh mục component và lộ
> trình cải tiến UI. Mọi thay đổi giao diện lớn nên đi kèm cập nhật ở đây.

---

## 🗺️ Bản đồ tài liệu đề xuất

| # | Tài liệu | Nội dung | Trạng thái |
|---|----------|----------|------------|
| 1 | `README.md` (file này) | Index + triết lý UI + snapshot thiết kế hiện tại | ✅ Có |
| 2 | `DESIGN-TOKENS.md` | Bảng màu, typography, spacing, radius, shadow — đối chiếu trực tiếp với Tailwind classes đang dùng | 📝 Đề xuất |
| 3 | `PAGE-ANATOMY.md` | Giải phẫu chuẩn 1 trang "trạm thí nghiệm": header → form → states → kết quả (chips + chart + ghi chú) | 📝 Đề xuất |
| 4 | `COMPONENTS.md` | Danh mục component tái sử dụng + các trạng thái (loading/error/empty/success) | 📝 Đề xuất |
| 5 | `UX-JOURNAL.md` | Nhật ký trải nghiệm: mỗi lần tự dùng app mà thấy "kỳ"/"vướng" thì ghi vào — nguyên liệu quý cho cải tiến | 📝 Đề xuất |
| 6 | `ROADMAP.md` | Backlog cải tiến UI có ưu tiên + độ khó (xem bản nháp phía dưới) | 📝 Đề xuất |

> Quy ước: tài liệu mới tạo thì đổi trạng thái thành ✅ và ghi 1 dòng mô tả ở bảng trên.

---

## 🧬 Triết lý UI hiện tại (3 nguyên tắc)

1. **Mỗi trang là một phòng thí nghiệm** — form tham số nằm trên, kết quả ngay dưới,
   người dùng luôn thấy *quan hệ nhân-quả* giữa "tôi chỉnh gì" và "biểu đồ đổi ra sao".
2. **Con số đi kèm ngữ cảnh** — không bao giờ hiển thị số trơ trọi: `s = 0.030`
   phải đứng cạnh `SE lý thuyết = 0.030` kèm badge xanh/vàng cho biết khớp hay lệch.
3. **Giáo dục bằng chú thích** — mọi kết quả đều kèm ghi chú mờ phía dưới giải thích
   ý nghĩa thống kê (VD: điều kiện Hull-Dobell, σ/√n).

---

## 📸 Snapshot thiết kế đang dùng (đối chiếu từ code)

> Đây là dữ liệu gốc cho tài liệu `DESIGN-TOKENS.md` khi được viết chi tiết.

**Màu sắc**

| Vai trò | Class | Ghi chú |
|---|---|---|
| Nền trang | `bg-gray-50` | |
| Bề mặt card | `bg-white` + `border-gray-200` + `shadow-sm` / `shadow-md` hover | radius `rounded-xl` |
| Màu chủ đạo (CTA, link, bar chart) | `bg-blue-600` · `text-blue-600` · fill `#2563eb` | hover `blue-700` |
| Thành công | `bg-green-50` / `text-green-700` | badge "Sẵn sàng", full-period |
| Cảnh báo | `bg-amber-50` / `border-amber-200` / `text-amber-700` | badge lệch chu kỳ, notes 💡 |
| Lỗi | `bg-red-50` / `border-red-200` / `text-red-700` + role="alert" | khối lỗi form/API |
| Text chính/phụ/mờ | `text-gray-900` / `text-gray-500` / `text-gray-400` | |

**Typography & layout**

- Tiêu đề trang: `text-2xl font-bold`; hero trang chủ: `text-3xl md:text-4xl font-extrabold`
- Nhãn form/chips: `text-sm font-medium` · hint dưới input: `text-xs text-gray-400`
- Container: `max-w-3xl` (trang chi tiết) / `max-w-5xl` (dashboard); padding `p-6`, gap `space-y-6`
- Form grid: `grid-cols-1 md:grid-cols-2` hoặc `-4` tùy số trường
- Input chuẩn: `px-3 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none`
- Chip trạng thái: `px-2.5 py-1 rounded-full text-xs font-medium`
- Biểu đồ Recharts: cao `320px`, Bar `radius={[3,3,0,0]}`, tick fontSize 11

**Trạng thái UI chuẩn hoá**: loading = đổi label nút + `disabled:opacity-50`;
error = khối đỏ `role="alert"`; empty = không render section kết quả.

---

## 🧪 Backlog cải tiến UI — bản nháp cho ROADMAP.md

*Quan sát thực tế sau 4 lần tự dùng app; sẽ chuyển thành ticket khi ROADMAP.md hoàn thiện.*

| Ưu tiên | Ý tưởng | Ghi chú kỹ thuật |
|---|---|---|
| 🔴 Cao | **Favicon + metadata icon** — tab trình duyệt đang trống | Thêm `app/icon.svg` (Next App Router tự nhận), tái dùng `/logo.svg` |
| 🔴 Cao | **Nav highlight trang hiện tại** — chưa biết đang ở đâu | `usePathname()` so sánh href, thêm class active |
| 🟠 TB | **Bảng/dạng lưới dãy LCG + nút Copy** — pre-text dài khó đọc | Grid 8 cột, `navigator.clipboard.writeText` |
| 🟠 TB | **Chia sẻ kết quả qua URL** — refresh là mất tham số | Đồng bộ form ↔ search params (`useSearchParams`) |
| 🟠 TB | **Tiêu đề trục + đơn vị trên biểu đồ** | XAxis/YAxis label của Recharts |
| 🟡 TBC | Dark mode | Tailwind `dark:` + toggle lưu localStorage |
| 🟡 TBC | Skeleton loading thay đổi chữ nút | Component `<Skeleton/>` chung |
| 🟡 TBC | A11y: `aria-live` cho vùng kết quả, không phụ thuộc màu alone | Kiểm tra bằng axe devtools |
| 🟢 Thấp | Mini sparkline trên card dashboard | Dùng lại endpoint histogram, SVG nhỏ |

---

## 🔄 Quy tắc bảo trì thư mục này

1. Đổi UI đáng kể → cập nhật snapshot/token trong cùng commit đó
2. Phát hiện vấn đề UX khi tự dùng → ghi ngay vào `UX-JOURNAL.md` trước khi sửa
3. Mọi item backlog lên đời → đánh dấu ưu tiên + ước lượng độ khó

