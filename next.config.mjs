
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'res.cloudinary.com',
        pathname:'/**',
      }
    ]
  },
  turbopack: {
    root: __dirname, // force correct project root
  },
};

export default nextConfig;
