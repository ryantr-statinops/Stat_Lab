# 🚀 INIT-GUIDE — Hướng dẫn khởi tạo ban đầu

> Tài liệu này đưa bạn từ **clone repo về máy trống** đến **chạy được toàn hệ thống**
> (backend API + frontend web) và **bộ test xanh**. Toàn bộ lệnh bên dưới đã được
> kiểm chứng trên Ubuntu 24.04 / Python 3.12 / Node 24.

---

## 🧭 Mục tiêu dự án (đọc trước khi chạy)

**Statistical Computing Lab** là một *phòng thí nghiệm thống kê tương tác*:

- Mỗi khái niệm thống kê (LCG, phân phối chuẩn, CLT...) = một trang web có form bấm nút + biểu đồ
- Toán học được viết thử bằng R trong `lab/R/` (sổ tay), rồi port sang Python thuần để phục vụ
- Xây từng "trạm thí nghiệm" theo đúng quy trình 6 bước = bài tập full-stack lặp lại được

```
┌─ Terminal 1 ─────────────┐    ┌─ Terminal 2 ─────────────┐
│ BACKEND  FastAPI         │◄───┤ FRONTEND Next.js         │
│ http://localhost:8000    │HTTP│ http://localhost:3000    │
└──────────────────────────┘    └──────────────────────────┘
```

---

## 📦 Yêu cầu môi trường

| Công cụ | Phiên bản tối thiểu | Kiểm tra |
|---------|--------------------|----------|
| Node.js | ≥ 18 (khuyến nghị 20+) | `node --version` |
| npm | ≥ 9 | `npm --version` |
| Python | 3.11+ | `python3 --version` |
| pip | bất kỳ | `python3 -m pip --version` |
| Git | bất kỳ | `git --version` |

> 💡 Nếu `python3 -m pip` báo *"No module named pip"*: bootstrap bằng
> `curl -sSL https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py && python3 /tmp/get-pip.py --user --break-system-packages`

---

## Bước 0 — Clone repo

```bash
git clone git@github.com:ryantr-statinops/Stat_Lab.git
cd Statistical_Computing_Function
```

---

## Bước 1 — Backend (Terminal 1)

```bash
cd backend/fastapi

# Cài dependencies (CHỈ lần đầu)
python3 -m pip install --user --break-system-packages -r requirements.txt

# Chạy server chế độ dev (tự restart khi sửa code)
python3 -m uvicorn main:app --reload
```

**Giải thích hai "cạm bẫy" thường gặp:**

1. Vì sao thêm `--break-system-packages`? — Ubuntu chặn pip cài thẳng vào Python hệ
   thống (PEP 668). Cờ này cho phép cài vào **user site** (`~/.local`), không đụng package hệ thống.
2. Vì sao gõ `python3 -m uvicorn` thay vì `uvicorn`? — Khi cài `--user`, binary nằm ở
   `~/.local/bin` có thể không nằm trong `$PATH`. Gọi qua python module thì luôn chắc chắn.

**✅ Kiểm tra:** mở trình duyệt vào <http://localhost:8000/docs> — thấy Swagger UI
liệt kê 5 endpoint (`/api/v1/lcg`, `/normal`, `/clt`, `/histogram`, `/`). Bấm
*Try it out* → *Execute* trên `/api/v1/lcg` và nhận JSON là backend đã sống.

---

## Bước 2 — Frontend (Terminal 2)

Mở **cửa sổ terminal thứ hai** (giữ Terminal 1 chạy nguyên):

```bash
cd frontend/next-app

# Cài dependencies (CHỈ lần đầu, hoặc sau khi package.json/lock thay đổi)
npm install

# Chạy dev server
npm run dev
```

Đợi dòng `✓ Ready`, rồi mở <http://localhost:3000>.

> 🧪 Muốn kiểm tra bản production-build mà **không làm hỏng** phiên `npm run dev`
> đang bật? Dùng kênh cách ly: `npm run verify:ui` — tự build vào thư mục
> `.next-verify` riêng và serve ở cổng 3100, không đụng vào `.next` của dev.
> (Lý do: dev/build dùng chung `.next` nếu không tách — xem Troubleshooting.)

**✅ Kiểm tra trải nghiệm trọn vẹn:**

1. Dashboard hiển thị 4 topic card: LCG · Phân phối chuẩn · CLT · Biến đổi ngược
2. Vào **LCG** → giữ tham số mặc định → bấm *"Sinh dãy số"*
   → thấy dãy số + badge *"Chu kỳ: 9 / 99"* + note Hull-Dobell
3. Vào **Chuẩn** → bấm *"Lấy mẫu & vẽ histogram"* → thấy đồ hình chuông
4. Vào **CLT** → tăng *Kích thước mẫu* lên `500` → chạy lại
   → biểu đồ thu hẹp quanh đường đỏ μ (định lý đang "hiện hình" trước mắt bạn!)

> 🔐 CORS đã được cấu hình sẵn trong backend cho `localhost:3000` — nếu bạn đổi port
> frontend, hãy bổ sung origin tương ứng vào `ALLOWED_ORIGINS` trong
> `backend/fastapi/main.py`.

### Bước 2b — Frontend thứ hai (Vite) — tùy chọn

Bản React SPA mirror của next-app, chạy song song được (cổng khác `:5173`):
```bash
cd frontend/vite-app
npm install
npm run dev                      # UI: http://localhost:5173
```
- Cùng API `:8000`; fetch thuần (không axios). Mở một lúc cả hai thì chạy 2 terminal.
- Xem bản build production: `npm run build` → `npm run preview` → cổng `:4173`.
- CORS backend đã cho phép cả `:3000`, `:5173`, `:4173`.

---

## Bước 3 — Bộ kiểm thử

```bash
# Từ thư mục gốc repo
python3 -m pytest tests -v                 # kỳ vọng: 33 passed

cd frontend/next-app && npm run build      # kỳ vọng: ✓ Compiled successfully
```

## ✅ Checklist "hệ thống sống"

| Mốc kiểm chứng | Cách kiểm | Kết quả đúng |
|---|---|---|
| Backend API | `curl localhost:8000/` | JSON message + version |
| Swagger | mở `/docs` | 5 endpoint hiển thị |
| Frontend build | `npm run build` | `✓ Compiled successfully` |
| Web ↔ API | bấm nút trên trang | có dữ liệu, không ô đỏ |

---

## 🚨 Troubleshooting nhanh

| Triệu chứng | Nguyên nhân | Cách chữa |
|---|---|---|
| `ModuleNotFoundError: fastapi/uvicorn` | Chưa cài deps backend | Chạy lại lệnh pip ở Bước 1 |
| pip báo `externally-managed-environment` | PEP 668 | Thêm `--break-system-packages` |
| `uvicorn: command not found` | Binary user-site ngoài $PATH | Dùng `python3 -m uvicorn ...` |
| Ô đỏ *"Không kết nối được API"* trên web | Backend chưa bật/crash | Kiểm tra Terminal 1 còn log không |
| Console trình duyệt báo CORS | Đổi port frontend | Thêm origin vào `ALLOWED_ORIGINS` |
| `EADDRINUSE :8000/:3000` | Port bị chiếm | `lsof -i :8000` → `kill <PID>` |
| `Cannot find module './xxx.js'` trong `.next/server/webpack-runtime.js` — mọi trang trả 500 | `.next` hỏng: dev/build đè lên nhau, hoặc server cũ còn sống trong lúc build | Tắt mọi server → `rm -rf .next` → chạy lại `npm run dev` |
| Sửa code frontend không thấy đổi | Cache Next.js | Ctrl+C → `rm -rf .next` → `npm run dev` |

**Khi nào cần chạy lại `npm install`?** — Sau mỗi lần `git pull` mà thấy
`package.json` hoặc `package-lock.json` thay đổi; khi clone sang máy khác;
hoặc bất cứ khi nào nghi ngờ (chi phí chỉ vài giây). Xác minh phiên bản:
`npm ls axios`.

---

## 🛡️ Ghi chú bảo mật lúc cài đặt

`npm install` có thể in cảnh báo `npm audit` — đó là npm đối chiếu dependency với
database lỗ hổng. **Đừng mù quáng chạy `npm audit fix --force`**: nó có thể nâng
major version và vỡ app (VD Next.js 14 → 16).

Trạng thái đã xử lý (xem chi tiết trong `plan/ideation.md` → *Tech Debt*):

- ✅ axios đã vá lên `1.19.0`
- ✅ Next.js ở bản vá `14.2.35`
- ⏸️ Nhóm advisory `next` + `postcss`: chủ động hoãn đến bài nâng cấp major riêng
  (các lỗi chủ yếu đánh vào tính năng self-hosted mà dự án không dùng)

---

## ➡️ Bước tiếp theo sau khi khởi tạo

1. Đọc `plan/ideation.md` để nắm roadmap và quy trình 6 bước thêm chủ đề mới
2. Đọc sổ tay R trong `lab/R/` + sách tham khảo tại `lab/Reference/`
3. Thử tự thêm trạm thí nghiệm thứ 4 (gợi ý: Bootstrap resampling)

