const routes = require('./routes')
const app = require('express')()

module.exports = ( imports ) => {
    for (const { path, method, script } of routes) {
        app[method]( '/' + path, async (req, res) => {
            try {
                await require(`./routes/${script}`)({ req, res }, imports)
            } catch ( error ) {
                res.status(500).json({ error })
            }
        })

        console.log(`${method.toUpperCase()} ${path} [routes/${script}]`)
    }

    return app
}