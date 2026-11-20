/** @type {import('next').NextConfig} */
const nextConfig = {
  // موقع ستاتيك 100%: next build بيطلّع فولدر out/ فيه HTML/CSS/JS جاهز
  // يترفع على أي استضافة ستاتيك (GitHub Pages / Netlify / Vercel / Nginx).
  output: 'export',
  trailingSlash: true,

  images: {
    // مفيش سيرفر لتحسين الصور في الـ static export
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
