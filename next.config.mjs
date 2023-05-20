/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: "file-loader",
      },
    });
    return config;
  },
};

export default nextConfig;
