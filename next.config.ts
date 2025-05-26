/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '', // hoặc không khai báo nếu không dùng
  async rewrites() {
    return [
      { source: '/', destination: '/ecom/home' },
    ]
  },
};

module.exports = nextConfig;
