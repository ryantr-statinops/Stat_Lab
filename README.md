# Statistical Computing Lab

> 🚀 **Full-stack lab** cho việc học và thử nghiệm các hàm thống kê tính toán

## 📚 Giới thiệu

Workspace giáo dục với định hướng **60% luyện full-stack web dev / 40% nội dung thống kê**:

- **Frontend**: Next.js 14 + Tailwind CSS — dashboard đa bài toán thống kê (port 3000)
- **Frontend mirror**: React 18 + TypeScript + Vite SPA tại `frontend/vite-app/` (port 5173)
- **Backend**: FastAPI + Python thuần — toàn bộ tính toán chạy bằng Python (port 8000)
- **lab/R/**: sổ tay bài lab bằng R — nơi viết thử công thức trước khi port sang Python; R **không** tham gia runtime

## ⚡ Quick Start (local dev)

> 📚 Lần đầu khởi tạo dự án? Xem hướng dẫn đầy đủ từng bước tại
> **[docs/guide/INIT-GUIDE.md](docs/guide/INIT-GUIDE.md)** — bao gồm yêu cầu môi
> trường, cài đặt backend/frontend, chạy test và troubleshooting.

### Backend (port 8000)
```bash
cd backend/fastapi
pip install -r requirements.txt
uvicorn main:app --reload
# Swagger UI: http://localhost:8000/docs
```

### Frontend (port 3000)
```bash
cd frontend/next-app
npm install
npm run dev
# UI: http://localhost:3000
```

### Frontend thứ hai (Vite, port 5173)
Bản React SPA mirror của next-app — cùng API, khác paradigm (fetch thuần + react-router):
```bash
cd frontend/vite-app
npm install
npm run dev
# UI: http://localhost:5173
```

> Chạy một lúc cả hai thì mở 2 terminal riêng (3000 và 5173). Muốn xem bản build
> production của Vite: `npm run build` rồi `npm run preview` → cổng 4173.

### Chạy kiểm thử
```bash
pip install -r backend/fastapi/requirements-dev.txt
python3 -m pytest tests -v                 # 31 unit + API tests

cd frontend/next-app && npm run build      # frontend build sạch
```

## 🚀 Deployment

Không dùng Docker Compose — deploy trực tiếp lên platform free tier:

| Thành phần | Platform | Cấu hình |
|------------|----------|----------|
| Frontend | **Vercel** | Root dir `frontend/next-app`, biến env `NEXT_PUBLIC_API_URL` trỏ về URL backend |
| Backend | **Railway / Fly.io / Render** | Root dir `backend/fastapi`, start: `uvicorn main:app --host 0.0.0.0 --port $PORT` |

> `backend/fastapi/Dockerfile` được giữ lại như tuỳ chọn container hoá backend khi cần.

## 🏗️ Cấu trúc dự án

```
stat-computing-lab/
├── README.md                     # Hướng dẫn nhanh
├── plan/
│   └── ideation.md               # Kế hoạch chi tiết
├── lab/
│   ├── R/                        # Sổ tay bài lab bằng R (LCG, Q_Func, Uni_distribution)
│   └── Reference/                # Sách tham khảo thống kê
├── backend/
│   └── fastapi/
│       ├── main.py              # FastAPI app
│       ├── services/
│       │   └── lcg_service.py   # Service LCG
│       ├── requirements.txt
│       └── Dockerfile
├── frontend/
│   └── next-app/
│       ├── app/page.tsx         # Homepage
│       ├── package.json
│       └── Dockerfile
├── tests/
│   └── test_lcg.py
├── docker-compose.yml
└── .gitignore
```

## 📊 API Endpoints

### LCG - Linear Congruential Generator
```bash
GET /api/v1/lcg?X0=3&a=7&n=20&c=4&m=99
```
Response kèm `cycle_length`, `theoretical_max_period` và `notes` gợi ý điều kiện chu kỳ đầy đủ (Hull-Dobell).

### Phân phối chuẩn — Box-Muller
```bash
GET /api/v1/normal?mean=0&std=1&n=5000&seed=42
```

### CLT — Định lý Giới hạn Trung tâm
```bash
GET /api/v1/clt?n_simulations=2000&sample_size=30&distribution=uniform
```
Kèm `empirical_mean/std` để so sánh trực tiếp với `theoretical_mean` và `theoretical_se = σ/√n`.

### Biến đổi ngược — Inverse Transform
```bash
GET /api/v1/inverse?distribution=geometric&p=0.3&n=5000&seed=42
GET /api/v1/inverse?distribution=exponential&lambda=3&n=5000
GET /api/v1/inverse?distribution=rayleigh&sigma=2&n=5000
```
Mirror từ `lab/R/inverse_transform_examples.R`: hỗ trợ `geometric` (công thức đóng &
tổng quát), `exponential`, `rayleigh`; response gồm `samples`, `sample_mean` và
`theory` (điểm pmf/pdf) để phủ đường lý thuyết lên histogram.

### Histogram server-side
```bash
GET /api/v1/histogram?source=normal&n=5000&n_bins=20
```
Trả về `bins: [{lower, upper, count}]` sẵn sàng nạp vào biểu đồ cột.

## 🛠️ Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | Next.js 14 + Tailwind CSS + Recharts |
| Backend | FastAPI + Python 3.11 |
| Computation | NumPy, random (Box-Muller, CLT) |
| Deploy | Vercel (frontend) · Railway/Fly.io (backend) |