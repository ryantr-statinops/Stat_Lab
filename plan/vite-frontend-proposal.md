# ⚡ Đề xuất: Frontend thứ hai bằng React + TypeScript + Vite

> **Trạng thái**: ✅ ĐÃ TRIỂN KHAI XONG — full mirror của `next-app` đang sống ở
> `frontend/vite-app/` (dev cổng :5173, build production đã verify). Phục vụ so sánh
> hai paradigm frontend trên cùng một sản phẩm thống kê.

## 🎯 Mục tiêu & định vị

Xây **SPA React 18 + TypeScript + Vite** tại `frontend/vite-app/` (ngang cấp với
`frontend/next-app/`), y chang tính năng hiện có của Next.js app:

```
Home (dashboard topic cards) · LCG (form + bảng lcg_table) · Chuẩn (histogram)
· CLT (mô phỏng + ReferenceLine μ)
```

Cả hai frontend cùng gọi API `:8000` — backend không đổi gì.

## 🧱 Stack quyết định

| Hạng mục | next-app | vite-app | Vì sao chọn |
|---|---|---|---|
| Routing | Next App Router (file-based) | **react-router-dom** + `NavLink` | NavLink built-in active highlight |
| Styling | Tailwind v3 | **Tailwind v3** giống hệt | Class tái sử dụng trực tiếp từ DESIGN-SYSTEM |
| Icon / Chart | lucide-react / Recharts | Giữ nguyên | Nhất quán |
| HTTP client | axios | **fetch thuần** | So sánh fetch vs axios giữa 2 app |
| Dev port | :3000 | :5173 (mặc định Vite) | Không xung đột |

## 📂 Cấu trúc thư mục dự kiến

```
frontend/
├── next-app/   (giữ nguyên)
└── vite-app/
    ├── index.html · vite.config.ts · tsconfig.json · package.json
    ├── public/logo.svg            (tái dùng)
    └── src/
        ├── main.tsx · App.tsx · router.tsx
        ├── pages/{Home,Lcg,Normal,Clt}.tsx
        ├── components/{SiteNav,BackChip}.tsx
        ├── lib/stats.ts           (bản sao — xem quy tắc đồng bộ)
        └── index.css              (@tailwind directives)
```

## 🔨 Lộ trình commit nhỏ (mỗi bước push riêng)

| # | Commit | Nội dung chính |
|---|---|---|
| 1 | `feat(vite): scaffold vite react-ts app` | Create-vite + xoá boilerplate demo |
| 2 | `feat(vite): wire tailwind design tokens` | PostCSS/Tailwind config theo DESIGN-SYSTEM |
| 3 | `feat(vite): router shell + feature dropdown nav` | SiteNav bản Vite (NavLink tự active) |
| 4 | `feat(vite): lcg page with steps table` | Form chuỗi-thô + bảng lcg_table 3 cột |
| 5 | `feat(vite): normal + clt pages with recharts` | Histogram Box-Muller + CLT ReferenceLine μ |
| 6 | `docs(ui): dual-frontend architecture notes` | Bảng so sánh + checklist mirror |

## ✅ Definition of Done

- [x] Cả 4 route hoạt động (`:5173` dev / `4173` preview), gọi API `:8000`, UI khớp DESIGN-SYSTEM
- [x] `/lcg`: ô input giữ được trạng thái rỗng (pattern chuỗi-thô), bảng 3 cột
      đều width + căn giữa + divide-x
- [x] `/normal` `/clt`: biểu đồ Recharts render đúng dữ liệu API
- [x] `npm run build` xanh trong `vite-app` (+ alias `@/` đăng ký trong vite.config)
- [x] EVOLUTION journal entry ghi mốc "dual frontend live"

## ⚠️ Quy tắc đồng bộ hai frontend

- Trùng lặp code/UI là **có chủ đích để học** — nhưng phải kiểm soát:
  thay đổi lớn ở bên nào → **checklist mirror** sang bên kia + append EVOLUTION.
- Về dài hạn: cân nhắc nâng **npm workspaces** chia package `shared/`
  (lib/stats, types...) — ghi roadmap, chưa làm ngay.
- Phase 2 (Docker Compose) sẽ bổ sung service `frontend-vite` optional
  (port `5173`) khi tới lúc compose hoá.

---

*Tạo: 2026-08-24 · Phụ thuộc: không — làm độc lập với lộ trình Go gateway.*
