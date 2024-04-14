/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        // domains: - deprecated in nextjs 14
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'paras-sarap-catering-reservation.s3.ap-northeast-1.amazonaws.com',
                port: '',
            },
        ],  
    },
    
    // experimental: {
    //     missingSuspenseWithCSRBailout: false,
    // },
};

export default nextConfig;