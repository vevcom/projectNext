/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = { 
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  
  // fix error with react-pdf use of canvas
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    
    return config;
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb',
    },
  },
}

module.exports = nextConfig
