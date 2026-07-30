import type { NextConfig } from "next";

const isPagesBuild = process.env.BUILD_TARGET === "pages";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isPagesBuild
    ? {
        output: "export" as const,
        trailingSlash: true,
        basePath,
        assetPrefix: basePath,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
