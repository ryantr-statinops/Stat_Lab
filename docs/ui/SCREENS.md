# 🖥️ SCREENS — Sơ đồ & giải phẫu màn hình

> Mỗi trang có một section riêng đánh số. **Thêm trang mới = thêm section theo
> template ở cuối file** — không tạo file .md mới.

## 1. Sitemap

### next-app (Next.js App Router)
```
frontend/next-app/app/
├── layout.tsx      # khung chung: header + nav + footer
├── page.tsx        # "/"           Tổng quan dashboard   (server component)
├── lcg/page.tsx    # "/lcg"        Trạm LCG              (client)
├── normal/page.tsx # "/normal"     Trạm phân phối chuẩn  (client)
└── clt/page.tsx    # "/clt"        Trạm CLT              (client)
```

### vite-app (React SPA + react-router)
```
frontend/vite-app/src/
├── main.tsx · App.tsx          # BrowserRouter + Routes trong khung chung
└── pages/{Home,Lcg,Normal,Clt}.tsx   # cùng 4 route, dev cổng :5173
```

Quy ước: trang dashboard là server component (tĩnh, nhẹ); mọi trang trạm là
`"use client"` vì cần state form.

## 2. Khung chung (`layout.tsx`)

```
┌────────────────────────────────────────────────────────┐
│ 🔷 StatLab        Tổng quan | LCG | Chuẩn | CLT   ←sticky│
├────────────────────────────────────────────────────────┤
│                    {children}                          │
├────────────────────────────────────────────────────────┤
│ footer: motto 1 dòng                                   │
└────────────────────────────────────────────────────────┘
```

- Header: `sticky top-0 bg-white/90 backdrop-blur border-b`, cao `h-14`
- Nav (`components/ui/SiteNav.tsx`, client component): link **Tổng quan** +
  dropdown **Feature ▾** gom LCG · Chuẩn · CLT; mở/đóng bằng click, tự đóng
  khi click ra ngoài hoặc khi chuyển trang
- Active state: mục khớp pathname được highlight `bg-blue-50 text-blue-700`
  (nút Feature cũng sáng khi đang ở bất kỳ trang trạm nào)

## 3. Giải phẫu chuẩn một trang "trạm thí nghiệm"

Mọi trang trạm đi theo cùng **5 khối**, thứ tự cố định:

```
⓪ BackLink     chip "← Tổng quan" trên cùng (next/link tĩnh về dashboard)
① PageHeader   kicker (tên kỹ thuật) → h1 → công thức/mô tả 1 dòng
② FormCard     card trắng grid các Field + nút submit span full
③ ErrorAlert   (render có điều kiện) role="alert"
④ Result       chips thống kê → notes giáo dục → card biểu đồ
```

Luật bất di bất dịch:
- **Mọi con số phải kèm đối chiếu lý thuyết** (`s ≈ σ`, `SE = σ/√n`)
- **Mọi kết quả phải có ít nhất 1 note giáo dục** giải thích ý nghĩa thống kê
- Tham số form hợp lệ/bất hợp lệ được kiểm tra **client-side trước** khi gọi API

## 4. `/` — Dashboard tổng quan

- Hero căn giữa + câu định vị dự án
- Grid 3 card topic: trạng thái `ready` → Link hover nổi; `soon` → dashed + opacity
- Card gồm: tên · badge trạng thái · mô tả · code công thức

## 5. `/lcg`

Khác biệt so với pattern: kết quả là **bảng tính từng bước** port từ hàm
`lcg_table` (lab/R/LCG.R) — 3 cột đều width (`table-fixed`), nội dung căn
giữa, phân cách dọc `divide-x`, zebra rows, scroll trong max-h-72; dữ liệu
đến từ trường `steps` của response API.
Badge chu kỳ đổi xanh khi `cycle_length == m`.

## 6. `/normal`

Form 4 trường (μ, σ, n, seed-text). Kết quả: histogram **40 bins tính client-side**
qua `lib/stats.ts` + chips `x̄ ≈ μ`, `s ≈ σ`.

## 7. `/clt`

Form có select phân phối nền. Kết quả: histogram trung bình mẫu +
`ReferenceLine` μ lý thuyết; badge so sánh `s` vs `SE` với ngưỡng chấp nhận 20%.

---

## 📋 Template — khi thêm trang trạm mới

```md
## N. /duong-dan — Tên trạm

BackLink: chip "← Tổng quan" (class chuẩn xem DESIGN-SYSTEM §4/§1)
Form: [liệt kê trường + ràng buộc]
Kết quả: [biểu đồ/dãy gì, bin bao nhiêu, tính ở đâu]
Đối chiếu lý thuyết: [chip nào so với gì]
Khác biệt so với pattern chuẩn: [ghi rõ nếu có]
```
