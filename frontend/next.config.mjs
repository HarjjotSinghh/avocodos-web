import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180
    }
  },
  swcMinify: false,
  // serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`
      }
    ]
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag"
      }
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@node-rs/argon2");
    }
    return config;
  }
};

export default nextConfig;
