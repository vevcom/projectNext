/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = { 
    sassOptions: {
      includePaths: [path.join(__dirname, 'src/styles')],
    },
    experimental: {
      serverActions: true
    }
}

module.exports = nextConfig
