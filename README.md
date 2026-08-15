# Statistical Computing Lab

> 🚀 **Full-stack lab** cho việc học và thử nghiệm các hàm thống kê tính toán

## 📚 Giới thiệu (Đã cập nhật)

Dự án đã chuyển đổi thành **workspace giáo dục** với kiến trúc multi-service:

- **Frontend**: Next.js + Tailwind CSS (SaaS UI - chạy trên port 3000)
- **Backend**: FastAPI + Python (chạy trên port 8000)
- **Services**: Các hàm thống kê được viết bằng Python (chuyển từ R gốc)

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

## 🛠️ Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend | FastAPI + Python 3.11 |
| Computation | NumPy |
| Container | Docker + Docker Compose |