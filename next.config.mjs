/** @type {import('next').NextConfig} */
const nextConfig = {
  darkMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "currency-detection-backend.onrender.com",
        pathname: "/static/uploads/**",
      },
    ],
  },
};

export default nextConfig;
