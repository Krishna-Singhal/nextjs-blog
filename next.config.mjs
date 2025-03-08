const cdnUrl = new URL(process.env.NEXT_PUBLIC_CDN_URL);

const nextConfig = {
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: cdnUrl.protocol.replace(":", ""),
                hostname: cdnUrl.hostname,
            },
        ],
    },
};

export default nextConfig;
