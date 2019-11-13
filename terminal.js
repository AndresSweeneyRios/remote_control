const { spawn } = require('child_process')
const path = require('path')

module.exports = async ({ ws }) => {
    const terminal = (client, { type }) => {
        let terminal

        switch (type) {
            case 'cmd':
                break
            case 'powershell':
                break
            
            case 'ubuntu':
                terminal = spawn('ubuntu')
                break
        }

        client.terminal = terminal

        const send = data => client.send(JSON.stringify(data))

        terminal.stdout.on('data', message => send({ type: 'output', message }))
        terminal.stderr.on('data', message => send({ type: 'output', message }))
        terminal.on('close', () => send({ type: 'closed' }))
    }

    const write = (client, input) => {
        client.terminal.write(`${input}\n`)
    }

    ws.on('connection', client =>
        client.on('message', unparsed => {
            try {
                const { event, message } = JSON.parse(unparsed) 
                switch (event) {
                    case 'spawn':
                        return terminal(client, message)

                    case 'write':
                        return write(client, message)
                }
            } catch { return console.error('[terminal] Parse Error') }
        })
    )
}