# 🧩 COMPONENTS — Khối dựng giao diện

> Danh mục khối UI và lộ trình tái sử dụng. **Thêm/sửa component = thêm section
> theo mẫu ở cuối file** — không tạo file .md mới.

## 📌 Trạng thái hiện tại

Đã có **2 component thật** trong `components/ui/`: `BackChip.tsx` và `SiteNav.tsx`
(dropdown điều hướng + active state, 2026-08-24). Các khối còn lại vẫn nội tuyến
trong `page.tsx` theo *rule of three* — bảng pseudo-catalog dưới đây là bản đồ
để tách đúng lúc.

## 🗂️ Pseudo-catalog (các khối lặp lại đang sống inline)

| Khối | Đang nằm ở | Props dự kiến khi tách | Trạng thái hỗ trợ |
|---|---|---|---|
| `PageHeader` | mọi trang trạm | `kicker`, `title`, `description` | tĩnh |
| `FormField` | mọi form | `name`, `label`, `hint`, `type`, value/onChange | loading n/a |
| `SubmitButton` | mọi form | `loading`, `labelIdle`, `labelBusy` | loading ✓ |
| `ErrorAlert` | mọi trang trạm | `message` | error ✓ |
| `StatChips` | /normal /clt /lcg | mảng `{ label, tone }` | success |
| `NoteList` | /lcg (hiện tại) | `notes[]` | success |
| `ChartCard` | /normal /clt | `title`, `data`, `children(Recharts)` | empty→ẩn |
| `TopicCard` | `/` | `topic{href?,title,desc,formula,status}` | ready/soon |
| `BackChip` | `/lcg` `/normal` `/clt` | `href="/"` (mặc định), `label="← Tổng quan"` | tĩnh |

## 🔁 Ma trận trạng thái chung

| Component | Loading | Error | Empty | Success |
|---|---|---|---|---|
| FormField | — | hint đỏ inline (kế hoạch) | — | — |
| SubmitButton | label busy + disabled | bật lại | — | label idle |
| ErrorAlert | ẩn | hiện | ẩn | ẩn |
| StatChips / ChartCard | không render | không render | không render | render |

## 🛣️ Lộ trình refactor

1. **Trigger**: khi thêm trang trạm thứ 4 tái dùng ≥3 khối ở trên → tạo
   `app/components/ui/*.tsx` với API prop tối thiểu như bảng
2. Mỗi component tách ra phải giữ đúng class chuẩn trong DESIGN-SYSTEM.md
3. ⚠️ **Khi đưa component vào thư mục mới**: nhớ bổ sung glob tương ứng vào
   `tailwind.config.js > content` — nếu không, Tailwind sẽ không sinh CSS cho
   các class trong file đó (bẫy đã từng dính: xem EVOLUTION 2026-08-24)
4. Chưa cần Storybook — giai đoạn này tự kiểm tra bằng 2 độ rộng trình duyệt

---

## 📋 Template — khai báo component (mới hoặc vừa tách)

```md
## TênComponent

- Vai trò: ...
- Props: `a: type`, `b?: type`
- Trạng thái: loading / error / empty / success — xử lý thế nào từng cái
- Nơi dùng: /route-a, /route-b
- Class gốc: trích dẫn chuỗi Tailwind chuẩn từ DESIGN-SYSTEM.md
```
