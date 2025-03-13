/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')],
    },

    // fix error with react-pdf use of canvas
    webpack: (config) => {
        config.resolve.alias.canvas = false

        return config
    },

    // The default directories which next will lint do not include tests
    eslint: {
        dirs: ['src', 'tests'],
    },
   
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '80',
                pathname: '/store/**',
                search: '',
            },
        ],
    }
}


module.exports = nextConfig
