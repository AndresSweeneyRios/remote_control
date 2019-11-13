const path = require('path')


// WebSocket

const WebSocket = require('ws')
const ws = new WebSocket.Server({ port: 6970 })


// Terminal

require('./terminal')({ ws })


// Express

const express = require('express')
const app = express()

app.use('/api', require('./router')({ ws }))

app.listen(6969)

console.log('API initialized')


// Next

const next = require('next')({ 
    dev: process.env.NODE_ENV !== 'production' 
})

next.prepare().then( () => {
    app.get('*', next.getRequestHandler())
})