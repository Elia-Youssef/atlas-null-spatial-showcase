import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function getLocalDevelopmentOrigins(): string[] {
  const addresses = Object.values(networkInterfaces())
    .flatMap((network) => network ?? [])
    .filter((address) => address.family === "IPv4" && !address.internal)
    .map((address) => address.address);

  return [...new Set(["127.0.0.1", "localhost", ...addresses])];
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  allowedDevOrigins: getLocalDevelopmentOrigins(),
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
