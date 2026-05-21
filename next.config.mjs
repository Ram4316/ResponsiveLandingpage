/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Ensure we don't have trailing slash issues on GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
