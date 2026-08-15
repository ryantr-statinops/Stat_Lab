# 📊 Dự Án Lab Thống Kê Tính Toán

> **Mục tiêu**: Xây dựng một nền tảng web giáo dục cho phép thực hành thống kê tính toán với đa ngôn ngữ (R, Python, JavaScript)

---

## 🏗️ Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                                │
│                       (Next.js + Tailwind)                           │
└──────────────────────────┬────────────────────────────────────────────┘
                           │ HTTP API
┌──────────────────────────▼────────────────────────────────────────────┐
│                   API GATEWAY                                        │
│                    (FastAPI - Python)                                │
└─────────┬───────────────┬─────────────────┬──────────────────────────┘
          │               │                 │
┌─────────▼───┐   ┌───────▼─────┐   ┌───────▼───────────┐
│  R SERVICES │   │  PYTHON      │   │   CACHE/Redis     │
│ (plumber)   │   │ (NumPy/SciPy)│   │                   │
└─────────────┘   └──────────────┘   └───────────────────┘
```

---

## 🔧 Công Nghệ Dùng

| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| **Frontend** | Next.js 14, Tailwind CSS, Chart.js | SaaS UI đẹp, responsive |
| **API Gateway** | FastAPI (Python) | Tốc độ phát triển nhanh, tích hợp tốt với Python |
| **R Services** | Plumber | Chuyển đổi hàm R thành REST API |
| **Container** | Docker, Docker Compose | Dễ dàng deploy và môi trường đồng nhất |
| **Deploy** | Railway/Vercel hoặc Local Docker | Phù hợp để demo |

---

## 📅 Giai Đoạn Phát Triển

### **Stage 1: Setup Cơ Bản (Tuần 1-2)**
- [ ] Tạo cấu trúc thư mục workspace
- [ ] Thiết lập FastAPI backend
- [ ] Viết service wrapper cho R LCG
- [ ] Tạo API endpoint đầu tiên (`/api/v1/lcg`)
- [ ] Viết test cơ bản cho API

### **Stage 2: R + Python Integration (Tuần 3-4)**
- [ ] Tích hợp R service với FastAPI (subprocess hoặc HTTP)
- [ ] Thêm hàm: Normal Distribution (Box-Muller transform)
- [ ] Thêm hàm: Central Limit Theorem simulation
- [ ] Viết unit tests cho tất cả hàm
- [ ] Thiết lập Docker compose

### **Stage 3: Frontend Development (Tuần 5-6)**
- [ ] Tạo Next.js app với App Router
- [ ] Thiết kế dashboard chính (chọn bài toán)
- [ ] Build form nhập tham số
- [ ] Tích hợp API calls với useEffect/useAction

### **Stage 4: Visualization & UI (Tuần 7-8)**
- [ ] Tích hợp Chart.js hoặc Recharts
- [ ] Biểu đồ Histogram, CDF, QQ-Plot, Boxplot
- [ ] Thêm interactive controls
- [ ] Thiết kế responsive, dark mode

### **Stage 5: Polish & Documentation (Tuần 9-10)**
- [ ] Viết documentation chi tiết
- [ ] Tối ưu hóa performance
- [ ] Thêm loading states và error handling
- [ ] Viết hướng dẫn setup cho môi trường dev

---

## 📚 Case Study Thống Kê (Bài Toán)

| # | Chủ đề | Hàm mô phỏng | Visualization | Skills thực hành |
|---|--------|--------------|---------------|-------------------|
| 1 | Phân phối ngẫu nhiên | LCG, Box-Muller | Histogram, PDF/CDF | Random num gen, API |
| 2 | Thu Thống Đời | Bootstrap, Jacknife | Sampling Distribution | Resampling, CI |
| 3 | Kiểm định giả thuyết | t-test, z-test | QQ-Plot, Shapiro-Wilk | Hypothesis testing |
| 4 | Hồi quy | Linear Regression | Scatter + Line | Regression, R² |
| 5 | Phân khúc | Chi-square, ANOVA | Boxplot | Categorical data |

---

## 🎯 API Endpoints Mẫu

```bash
# LCG Random Generator
GET /api/v1/lcg?X0=3&a=7&n=100&c=4&m=9999
Response: {
  "sequence": [3, 25, 180, ...],
  "visualization": "histogram_url"
}

# CLT Demo  
GET /api/v1/clt?samples=30&n=1000&distribution=uniform
Response: {
  "sample_means": [...],
  "plot": "chart_url"
}
```

---

## 🚀 Bắt Đầu Phát Triển

```bash
# Clone và setup
git clone <repo-url>
cd stat-computing-lab

# Setup backend
cd backend/fastapi
pip install -r requirements.txt
uvicorn main:app --reload

# Setup frontend  
cd frontend/next-app
npm install
npm run dev

# Chạy tất cả với Docker
docker-compose up --build
```

---

## ✨ Benefits Dự Án

- ✅ **Học full-stack web development** từ A-Z
- ✅ **Luyện kỹ năng R cho thống kê** trong môi trường thực tế
- ✅ **Hiểu sâu về API design** và microservices
- ✅ **Có thể showcase** trong portfolio hoặc CV
- ✅ **Tài liệu giáo dục** cho bạn bè, đồng nghiệp

---

## ❓ Câu Hỏi Chưa Giải Quyết

1. Phương thức gọi R: subprocess vs HTTP call?
2. Cần Redis cache không?
3. Deploy lên cloud hay chạy local?

*File này sẽ được cập nhật theo tiến độ phát triển*

---
**Tạo bởi**: Hệ thống  
**Ngày tạo**: 2026-08-15  
**Phiên bản**: 0.1.0 (draft)