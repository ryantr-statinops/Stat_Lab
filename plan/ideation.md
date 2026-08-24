# 📊 Dự Án Lab Thống Kê Tính Toán

> **Mục tiêu**: Nền tảng web học thống kê tính toán — **ưu tiên luyện full-stack web dev (60%)**, nội dung thống kê đóng vai trò "đề bài" thực hành (40%).

> 🔄 **Cập nhật định hướng (2026-08-24)**: Bỏ phương án dùng R làm backend (Plumber/subprocess) và bỏ Redis cache. Backend chạy thuần Python; `lab/R/` chỉ còn là **sổ tay bài lab** — nơi viết thử công thức bằng R trước khi port sang Python khi cần làm feature web tương ứng.

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
| **Frontend** | Next.js 14, Tailwind CSS, Recharts | Dashboard đa bài toán, responsive |
| **Backend** | FastAPI (Python thuần) | Toàn bộ tính toán bằng Python/NumPy |
| **Sổ tay lab** | R scripts (`lab/R/`) + sách Rizzo | Thử công thức trước khi port sang Python |
| **Deploy** | Frontend → Vercel, Backend → Railway/Fly.io | Không cần Docker Compose |

❌ **Đã loại bỏ khỏi roadmap**: Plumber (R-as-a-service), Redis, kiến trúc multi-service, Docker Compose.

---

## 📅 Giai Đoạn Phát Triển (định hướng mới 2026-08-24)

### **Stage 0: Chốt dọn workspace** ✅
- [x] Commit thay đổi treo ở `lab/R/UNI_D.R`
- [x] Khóa định hướng 60/40 trong tài liệu

### **Stage 1: Dọn kỹ thuật nợ backend** ✅
- [x] Refactor `main.py` gọi `services/lcg_service.py` thay vì inline
- [x] Sửa expected values sai trong test LCG
- [x] Thêm pytest vào requirements-dev, chạy green toàn bộ test (31 passed)
- [x] Phân tích chu kỳ LCG (cycle length) trong response

### **Stage 2: Frontend sống lại** ✅
- [x] Bổ sung `layout.tsx`, tsconfig, cài Tailwind đúng chuẩn (+ nâng Next lên bản vá bảo mật 14.2.35)
- [x] Dashboard shell + điều hướng chọn bài toán
- [x] Client validation + loading/error states

### **Stage 3: Mở rộng nội dung thống kê** ✅
- [x] Endpoint Box-Muller (phân phối chuẩn)
- [x] Endpoint mô phỏng CLT
- [x] Endpoint histogram bins (server-side)
- [x] Trang frontend tương ứng với biểu đồ Recharts

### **Stage 4: Deploy không Docker**
- [x] Gỡ `docker-compose.yml`, `Dockerfile.dev` (giữ Dockerfile backend như tuỳ chọn)
- [ ] Frontend → Vercel, Backend → Railway/Fly.io *(hướng dẫn đã có trong README, chờ tài khoản platform)*
- [x] README quick start theo flow mới

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

## ✅ Quyết Định Đã Chốt

1. ~~Phương thức gọi R: subprocess vs HTTP call?~~ → **Không gọi R từ backend**, port logic sang Python khi cần.
2. ~~Cần Redis cache không?~~ → **Không**, kết quả tính toán tức thời theo request.
3. ~~Deploy lên cloud hay chạy local?~~ → **Cloud platform free tier** (Vercel + Railway/Fly.io).

*File này sẽ được cập nhật theo tiến độ phát triển*

---
**Tạo bởi**: Hệ thống  
**Ngày tạo**: 2026-08-15  
**Phiên bản**: 0.1.0 (draft)