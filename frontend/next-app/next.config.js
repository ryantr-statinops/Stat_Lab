/** @type {import('next').NextConfig} */
// distDir tách riêng qua biến môi trường: các lần build kiểm chứng
// (npm run verify:ui) dùng .next-verify, không đè lên .next của `next dev`.
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
}

module.exports = nextConfig

module.exports = nextConfig