/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'sample-videos.com',
            }
        ],
    },
    env: {
        NEXT_PUBLIC_BACKEND_URL: 'http://localhost:5000',
    }
};

export default nextConfig;
