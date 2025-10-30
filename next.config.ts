import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_TURNSTILE_SITEKEY: process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY,
  },
  // Transpile TensorFlow and MediaPipe packages for Next.js compatibility
  transpilePackages: ["@mediapipe/face_detection"],
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "store.storeimages.cdn-apple.com",
      "profile.line-scdn.net",
      "cdn.simpleicons.org",
      "applehouseth.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
