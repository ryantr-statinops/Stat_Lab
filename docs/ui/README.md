# 🎨 UI Documentation — Statistical Computing Lab

> Cổng vào duy nhất của tài liệu giao diện. Bộ file ở đây là **cố định**:
> mọi nội dung mới đều phát triển *bên trong* các file có sẵn theo đúng section
> template — không sinh thêm file `.md` mới.

---

## 🗺️ Bản đồ 5 file

| File | Trả lời câu hỏi | Scale bằng gì |
|---|---|---|
| `README.md` | Thư mục này vận hành thế nào? Nguyên lý & quy tắc? | Cập nhật khi quy tắc/nguyên lý thay đổi (hiếm) |
| `DESIGN-SYSTEM.md` | Màu/chữ/spacing/chart chuẩn là gì? | Thêm hàng bảng token hoặc section loại UI mới |
| `SCREENS.md` | Có những màn hình nào, giải phẫu ra sao? | Thêm section theo Template cho mỗi trang mới |
| `COMPONENTS.md` | Có khối dựng nào, tách component lúc nào? | Khai báo pseudo-component mới hoặc ghi nhận đã tách |
| `EVOLUTION.md` | Điều gì xảy ra theo thời gian? Backlog còn gì? | Append entry mới nhất lên đầu; backlog cập nhật |

## 🧭 Định tuyến nhanh — "tôi cần X thì mở Y"

| Tình huống | Mở file |
|---|---|
| Muốn thêm màu/icon/motion mới | DESIGN-SYSTEM §1–§7 |
| Sắp code một trang trạm thí nghiệm mới | SCREENS §3 (pattern) + §Template |
| Thắc mắc vì sao chưa tách component | COMPONENTS ⚠️ + 🛣️ |
| Thấy chỗ nào "kỳ" khi tự dùng app | EVOLUTION → append `JOURNAL` |
| Chỉnh sửa UI xong, chưa biết đủ chưa | ✅ Definition of Done phía dưới |

## 🧬 Ba nguyên tắc thiết kế

1. **Mỗi trang là một phòng thí nghiệm** — form trên, kết quả dưới, người dùng luôn
   thấy quan hệ nhân-quả giữa tham số và biểu đồ.
2. **Con số đi kèm ngữ cảnh** — không hiển thị số trơ trọi: luôn ghép thực nghiệm
   cạnh lý thuyết (`s ≈ σ`, `s` vs `SE`) kèm badge khớp/lệch.
3. **Giáo dục bằng chú thích** — kết quả nào cũng có note giải thích ý nghĩa thống kê.

## 📏 Quy tắc scale (bắt buộc)

1. **Cấm tạo file `.md` mới** trong thư mục này nếu chưa thống nhất — bộ 5 file
   được thiết kế để chứa mọi loại nội dung UI của dự án.
2. Nội dung mới luôn đi vào **section đánh số** hoặc **bảng** sẵn có của file phù hợp;
   mỗi file có template riêng đặt ở cuối.
3. Entry thời gian (nhật ký/backlog) chỉ sống ở `EVOLUTION.md` — file khác không ghi log.
4. Tên section tiếng Việt, nhất quán với thuật ngữ kỹ thuật tiếng Anh trong ngoặc.

## ✅ Definition of Done cho một thay đổi UI

- [ ] Class/token dùng đúng `DESIGN-SYSTEM.md` (không tự chế màu ngoài hệ)
- [ ] Nếu thêm/sửa màn hình → `SCREENS.md` có section tương ứng
- [ ] Nếu xuất hiện khối lặp lại lần ≥2 → cân nhắc ghi vào `COMPONENTS.md`
- [ ] `EVOLUTION.md` append ít nhất 1 entry mô tả thay đổi + lý do
- [ ] `npm run build` xanh; tự bấm thử ở ~1280px và ~375px width
- [ ] Commit message nói rõ vùng UI bị ảnh hưởng

## 🔗 Liên kết

- Hướng dẫn khởi chạy dự án: [`docs/guide/INIT-GUIDE.md`](../guide/INIT-GUIDE.md)
- Roadmap tổng & tech-debt: [`plan/ideation.md`](../../plan/ideation.md)
