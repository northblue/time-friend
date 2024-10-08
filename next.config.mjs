/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
    },
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
          ignored: /node_modules/,
        };
      }
      config.resolve.alias['@'] = path.resolve(__dirname);
      return config;
    },
  };

export default nextConfig;
