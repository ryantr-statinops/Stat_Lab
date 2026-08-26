# 🚪 Đề xuất: Golang làm API Gateway cho Statistical Computing Lab

> **Trạng thái**: DRAFT — tài liệu để bạn đánh giá hướng kiến trúc trước khi
> triển khai. Chưa chỉnh sửa code.

## 🎯 Mục tiêu

- Đưa **Golang** làm lớp **API Gateway** :8000 — điểm vào duy nhất từ frontend.
- **FastAPI** giữ nguyên vai trò **backend service tính toán thống kê** :8011.
- Frontend (Next.js) **không đổi logic**, chỉ trỏ `NEXT_PUBLIC_API_URL` về gateway Go.

## 🏗 Sơ đồ hệ thống sau khi chuyển

```
frontend (3000)
      │  HTTP (chỉ có 1 đích: Go Gateway)
      ▼
[ Golang Gateway :8000 ]                            ← lớp điều phối chính
      │  /api/v1/lcg
      │  /api/v1/normal
      │  /api/v1/clt          ── forward ──▶  [ FastAPI :8011 ]
      │  /api/v1/histogram                           ←─ khối tính toán thống kê
      │
      └── health, meta, fallback ──────────────────  (Go tự xử lý, không vào FastAPI)
```

## 📂 Phân chia route thành 2 nhóm

### Nhóm A — Tính toán thống kê → Forward chặt chẽ tới FastAPI

| Route | Forward tới | Ghi chú |
|---|---|---|
| `GET /api/v1/lcg` | FastAPI `:8011` | Giữ nguyên query params, path, headers |
| `GET /api/v1/normal` | FastAPI `:8011` | — |
| `GET /api/v1/clt` | FastAPI `:8011` | — |
| `GET /api/v1/histogram` | FastAPI `:8011` | — |

- **Gate Go làm**: nhận request → giữ nguyên path/query/header → chuyển sang 8001.
- **Response**: lấy kết quả từ FastAPI trả về frontend (reverse-proxy 1:1).
- **Validation tham số**: ủy thác cho FastAPI/Pydantic như hiện tại (không làm 2 lần).

### Nhóm B — Go tự xử lý (không cần FastAPI)

| Route | Xử lý bởi | Nội dung |
|---|---|---|
| `GET /health` | Gateway Go | Kiểm tra sức khỏe gateway + ping service FastAPI |
| `GET /api/v1/meta` | Gateway Go | Thông tin dự án, phiên bản, danh sách service |
| `/*` (còn lại) | Gateway Go | Fallback trả 404/405 có JSON rõ ràng |

---

## 🔒 CORS & an toàn khi có gateway

- **CORS chỉ cấu hình ở gateway Go** (quyết định origin frontend được phép).
- FastAPI `:8011` **không mở CORS** cho internet — chỉ nhận từ gateway.
  → Vậy phải **tắt/đóng CORS middleware trong FastAPI** (đảo ngược so với bây giờ, để CORS nằm duy nhất 1 chỗ).
- Chỉ gateway mở cổng ra ngoài; các service con chạy trong mạng nội bộ.

---

## Thay đổi khi triển khai (ảnh hưởng tới code hiện có)

| Hạng mục | Hiện tại | Sau khi có gateway |
|---|---|---|
| Port FastAPI | `:8000` | `:8001` |
| CORS | FastAPI tự cấu hình | Chuyển về Go; FastAPI tắt |
| Frontend gọi | `localhost:8000` | `localhost:8000` (gateway Go) |
| `test_api.py` | Root thẳng FastAPI endpoint | Helper gọi gateway (hoặc vẫn test FastAPI riêng qua TestClient + thêm test forward ở Go) |
| `docker-compose`/run | (không dùng) | Cần cách chạy 3 tiến trình (Go + FastAPI + Next) — thủ công sau này nếu muốn |

*Lưu ý: `python3 -m uvicorn main:app --port 8001 --reload` sẽ là lệnh chạy FastAPI mới.*

---

## ✅ Lợi ích / ⚠️ Rủi ro khi đi hướng này

| Lợi ích | Rủi ro / cần cân nhắc |
|---|----|
| Học Go thực chiến (net/http, reverse-proxy, middleware, CORS) | Công sức viết gateway + test |
| FastAPI không đổi logic, giữ 38 tests & tài liệu | Phải quản lý thêm 1 process khi chạy local |
| Kiến trúc mở rộng rõ ràng: thêm service mới = "cắm" route vào Go thôi | Thời gian dành cho thống kê giảm để viết Go (đúng 60/40, 80% vào full-stack) |
| Microservice flow đúng nghĩa (frontend chỉ biết gateway) | Vẫn cần quyết định validate & docs nằm ở đâu (đề xuất: FastAPI giữ Swagger dùng nội bộ) |

---

## 🤝 Tiêu chí chốt (30 giây đánh giá)

- [ ] Tôi đồng ý FastAPI giữ toàn bộ nhóm tính toán (nếu chưa, tôi muốn chuyển tính ra riêng)
- [ ] Gateway Go lo health/meta/fallback + **CORS tập trung**
- [ ] When chuyển, FastAPI rời sang `:8001`, frontend trỏ gateway `:8000`
- [ ] Test tích hợp: đảm bảo gateway forward đúng tới FastAPI trước khi thêm tính mới

---

*File này là bản nháp; khi bạn duyệt mình sẽ lập dàn công việc (roadmap tasks) chi tiết gì với branch/commit theo từng phần. Dựng: 2026-08-24*