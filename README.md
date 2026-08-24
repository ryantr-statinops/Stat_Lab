# Statistical Computing Lab

> 🚀 **Full-stack lab** cho việc học và thử nghiệm các hàm thống kê tính toán

## 📚 Giới thiệu

Workspace giáo dục với định hướng **60% luyện full-stack web dev / 40% nội dung thống kê**:

- **Frontend**: Next.js 14 + Tailwind CSS — dashboard đa bài toán thống kê (port 3000)
- **Backend**: FastAPI + Python thuần — toàn bộ tính toán chạy bằng Python (port 8000)
- **lab/R/**: sổ tay bài lab bằng R — nơi viết thử công thức trước khi port sang Python; R **không** tham gia runtime

## ⚡ Quick Start

### Chạy toàn bộ với Docker
```bash
docker-compose up --build
# API: http://localhost:8000
# Frontend: http://localhost:3000
```

### Chỉ chạy Backend
```bash
cd backend/fastapi
pip install -r requirements.txt
uvicorn main:app --reload
# API: http://localhost:8000/docs
```

### Chỉ chạy Frontend
```bash
cd frontend/next-app
npm install
npm run dev
# UI: http://localhost:3000
```

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

### Đang phát triển (Stage 3)
- `GET /api/v1/normal` — lấy mẫu phân phối chuẩn (Box-Muller)
- `GET /api/v1/clt` — mô phỏng Central Limit Theorem
- `GET /api/v1/histogram` — binning server-side cho biểu đồ

## 🛠️ Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend | FastAPI + Python 3.11 |
| Computation | NumPy |
| Container | Docker + Docker Compose |