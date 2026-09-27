/** @type {import('next').NextConfig} */
const nextConfig = {
  darkMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "currency-recognition-api-lw35.onrender.com",
        pathname: "/static/uploads/**",
      },
    ],
  },
};

export default nextConfig;
