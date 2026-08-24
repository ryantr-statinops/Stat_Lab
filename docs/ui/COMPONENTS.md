# 🧩 COMPONENTS — Khối dựng giao diện

> Danh mục khối UI và lộ trình tái sử dụng. **Thêm/sửa component = thêm section
> theo mẫu ở cuối file** — không tạo file .md mới.

## ⚠️ Trạng thái hiện tại (ghi nhận trung thực)

Toàn bộ JSX hiện **nội tuyến trong từng `page.tsx`**, chưa có component tách file.
Đây là nợ kỹ thuật **có chủ đích** theo *rule of three*: chưa tách khi mới chỉ có
3 trang, tránh trừu tượng hoá sớm. File này là bản đồ để tách đúng lúc.

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
3. Chưa cần Storybook — giai đoạn này tự kiểm tra bằng 2 độ rộng trình duyệt

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
