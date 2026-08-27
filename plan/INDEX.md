# 🗺️ INDEX — Kho kế hoạch của dự án

> Thư mục này chứa các **tài liệu định hướng** (proposal/roadmap) trước khi đụng code.
> Mỗi file mô tả một hướng phát triển kèm lộ trình commit chi tiết. Mục đích đọc thứ tự gợi ý ở cuối trang.

---

## 📋 Danh mục tài liệu

| # | Tài liệu | Chủ đề | Trạng thái | Kết nối |
|---|----------|--------|------------|---------|
| 1 | [`ideation.md`](ideation.md) | **Định hướng gốc**: mục tiêu 60% full-stack / 40% thống kê, stack đã chốt, Stage 0–4 + Tech Debt | ✅ LIVING DOC — cập nhật liên tục | Nền tảng cho mọi proposal |
| 2 | [`golang-gateway-proposal.md`](golang-gateway-proposal.md) | **Golang làm API Gateway** :8000 · FastAPI rời sang :8011 giữ toàn bộ tính toán · chia route Nhóm A (forward) / Nhóm B (Go tự lo) · CORS tập trung ở gateway | 🟡 ĐỀ XUẤT ĐÃ DUYỆT — chờ triển khai Phase 1 | Phase 2 sẽ bổ sung `frontend-vite` vào Compose |
| 3 | [`vite-frontend-proposal.md`](vite-frontend-proposal.md) | **Frontend thứ hai** React18+TS+Vite :5173 — full mirror của next-app (4 trang), HTTP bằng fetch thuần, so sánh hai paradigm | ✅ ĐÃ TRIỂN KHAI XONG | API không đổi; độc lập với proposal #2 |

## 🔗 Quan hệ & phụ thuộc

```
ideation.md ──định hướng chung──▶ golang-gateway-proposal.md
            └──định hướng chung──▶ vite-frontend-proposal.md
                                        │
   golang Phase 2 (Compose) ◀──khi tới hạn──┘ (bổ sung service frontend-vite)
```

- Hai proposal **độc lập triển khai được song song**, chỉ giao nhau tại mục Compose (Phase 2 của Go gateway).
- Cả hai đều **không chạm backend logic** hiện tại (38 tests xanh là đường baseline).

## 🧭 Thứ tự đọc gợi ý cho người mới

1. `README.md` (tổng quan nhanh dự án)
2. `docs/guide/INIT-GUIDE.md` (chạy được local)
3. `plan/ideation.md` (hiểu vì sao project tồn tại)
4. Proposal đang được thực hiện (hiện: #2 Go Gateway)

## ✍️ Quy tắc khi thêm tài liệu mới vào thư mục này

1. Đặt tên dạng `<chủ-de>-proposal.md` hoặc `-plan.md`, kèm dòng **Trạng thái** đầu file
2. Append thêm hàng mới vào bảng Danh mục phía trên (không bỏ qua bước này!)
3. Ghi rõ kết nối/phụ thuộc nếu proposal có giao với cái cũ
