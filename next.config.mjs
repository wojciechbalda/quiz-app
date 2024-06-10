/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                hostname: 'pixabay.com',
                port: '',
                protocol: 'https',
            }
        ]
    }
};

export default nextConfig;
