require('dotenv').config()

const withSass = require('@zeit/next-sass')

module.exports = withSass({
    cssModules: true,
    env: {
        EXPRESS_PORT: process.env.EXPRESS_PORT || 6969,
        WEBSOCKET_PORT: process.env.WEBSOCKET_PORT || 6970,
    },
})