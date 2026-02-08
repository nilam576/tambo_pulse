/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        "@tambo-ai/react",
        "@tambo-ai/typescript-sdk"
    ],
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
