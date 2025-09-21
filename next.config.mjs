/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "https", hostname: "*.booking.com" },
    ],
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  eslint: { ignoreDuringBuilds: false }, // enforce lint gates
  typescript: { ignoreBuildErrors: false }, // enforce TS gates
};
export default nextConfig;
