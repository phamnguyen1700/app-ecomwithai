import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/ecom/home",
                permanent: false,
            },
        ];
    },
    images: {
        remotePatterns: [   
            {
                protocol: "https",
                hostname: "tse1.explicit.bing.net",
            },
            {
                protocol: "https",
                hostname: "yoosun.vn",
            },
            {
                protocol: "https",
                hostname: "blogchamsoc.com",
            },
            {
                protocol: "https",
                hostname: "file.hstatic.net",
            },
            {
                protocol: "https",
                hostname: "vitaclinic.vn",
            },
            {
                protocol: "https",
                hostname: "th.bing.com",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
            },
        ],
    },
};

module.exports = nextConfig;
