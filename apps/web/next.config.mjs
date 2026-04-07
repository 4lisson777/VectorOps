/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  // Enable standalone output for Docker deployments
  output: "standalone",
  // Prevent Next.js from bundling native addons — they must stay as external requires
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
}

export default nextConfig
