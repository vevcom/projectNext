/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = { 
    //Add some random config because of some issue with hot reload of next in docker
    //This config might not be neccessary on later next releases
    webpackDevMiddleware: config => {
      config.watchOptions = {
        poll: 800,
        aggregateTimeout: 300,
      }
      return config
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'src/styles')],
    },
}

module.exports = nextConfig
