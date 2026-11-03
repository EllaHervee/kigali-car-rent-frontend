import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_URL ||
      (process.env.NODE_ENV === "production"
        ? undefined
        : "http://localhost:3001");
    if (!backendUrl) {
      console.warn(
        "BACKEND_URL is not set; API requests will not be forwarded until the backend is deployed."
      );
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
