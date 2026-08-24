# 🎨 DESIGN-SYSTEM — Ngôn ngữ thị giác chuẩn

> Nguồn chân lý về token & quy ước giao diện. **Scale bằng cách thêm dòng vào bảng
> hoặc thêm section đánh số mới** — tuyệt đối không tạo file .md mới trong thư mục này.

## 📐 Cách đóng góp vào file này

- Muốn thêm **màu/token mới** → thêm hàng vào bảng §1, ghi rõ vai trò
- Token **đổi giá trị** → sửa thẳng bảng + append 1 entry `DECISION` vào `EVOLUTION.md`
- Xuất hiện **loại thành phần UI hoàn toàn mới** (VD: toast, modal) → thêm section
  đánh số tiếp theo theo mẫu: *Class chuẩn · Biến thể · Trạng thái · Ví dụ nơi dùng*

---

## 1. Màu sắc

| Vai trò | Class / Giá trị | Ghi chú |
|---|---|---|
| Nền trang | `bg-gray-50` | |
| Bề mặt card | `bg-white` + `border-gray-200` + `shadow-sm` | radius `rounded-xl`; hover nâng `shadow-md` + `border-blue-300` |
| Chủ đạo (CTA/link/bar) | `bg-blue-600` · `text-blue-600` · fill `#2563eb` | hover `bg-blue-700` |
| Focus ring input/nút | `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none` | |
| Thành công | `bg-green-50` / `text-green-700` | badge "Sẵn sàng", chu kỳ đầy đủ |
| Cảnh báo | `bg-amber-50` / `border-amber-200` / `text-amber-700` | badge lệch chu kỳ, notes 💡 |
| Lỗi | `bg-red-50` / `border-red-200` / `text-red-700` + `role="alert"` | |
| Đường tham chiếu biểu đồ | stroke `#dc2626` dash `4 4` | đường μ lý thuyết ở CLT |
| Text chính / phụ / mờ | `text-gray-900` / `text-gray-500` / `text-gray-400` | |

## 2. Typography

| Element | Class |
|---|---|
| Hero trang chủ | `text-3xl md:text-4xl font-extrabold tracking-tight` |
| Tiêu đề trang | `text-2xl font-bold` |
| Kicker trên tiêu đề (tên thuật toán) | `text-sm font-medium text-blue-600` |
| Nhãn form / chip | `text-sm font-medium` |
| Mô tả phụ | `text-sm text-gray-500` |
| Hint dưới input / footer note | `text-xs text-gray-400` |

## 3. Spacing & Layout

| Hạng mục | Giá trị |
|---|---|
| Container trang chi tiết | `max-w-3xl mx-auto p-6 space-y-6` |
| Container dashboard | `max-w-5xl mx-auto p-6` |
| Card padding | `p-6`, gap form `gap-4`, section gap `space-y-4/6` |
| Form grid | `grid-cols-1 md:grid-cols-2` (≤4 trường) hoặc `md:grid-cols-4` (≥5 trường + nút span full) |

## 4. Form controls

| Phần | Chuẩn |
|---|---|
| Input/select | `w-full px-3 py-2 border border-gray-300 rounded-md` + focus ring §1 |
| Label | `<label htmlFor>` luôn ghép id — phục vụ a11y |
| Hint | `text-xs text-gray-400 mt-1` ngay dưới input |
| Validation | Hiện tại gom về alert tổng phía dưới form; kế hoạch: chuyển inline `text-xs text-red-600` dưới từng field |

## 5. Biểu đồ (Recharts)

| Hạng mục | Chuẩn |
|---|---|
| Chiều cao | `320px`, bọc `ResponsiveContainer` |
| Margin | `{ top: 8, right: 8, bottom: 8, left: 8 }` |
| Bar | `fill="#2563eb"` `radius={[3,3,0,0]}` dataKey `count` |
| Tick | `fontSize: 11`, XAxis `interval="preserveStartEnd"`, YAxis `allowDecimals={false}` |
| Tooltip | formatter `[value, tên-loại]`, labelFormatter `Tâm bin ≈ {label}` |

## 6. Trạng thái UI

| Trạng thái | Quy ước hiện tại |
|---|---|
| Loading | Đổi label nút ("Đang...") + `disabled:opacity-50 transition-colors` |
| Error | Khối đỏ `role="alert"` dưới form |
| Empty | Không render section kết quả |
| Success | Chips thống kê + badge xanh/vàng theo ngưỡng so sánh |

## 7. Dự phòng (chưa dùng — khai báo trước để nhất quán sau này)

- **Dark mode**: sẽ dùng prefix `dark:` với cùng vai trò bảng §1; toggle lưu `localStorage`
- **Motion**: duration ngắn `150ms` (hover/focus), dài `300ms` (transition layout)
- **Z-index**: header sticky `z-10` là mốc cao nhất hiện có
