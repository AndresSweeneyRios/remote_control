const { spawn } = require('child_process')
const path = require('path')

module.exports = async ({ ws }) => {
    const terminal = (client, { type }) => {
        let terminal

        switch (type) {
            case 'cmd':
                terminal = spawn('cmd')
                break
            case 'powershell':
                terminal = spawn('powershell')
                break
            
            case 'ubuntu':
                terminal = spawn('ubuntu')
                break
        }

        client.terminal = terminal

        const send = data => {
            client.send(JSON.stringify(data))
        }

        terminal.stdout.on('data', message => send([ 'output', message.toString('utf8') ]))
        terminal.stderr.on('data', message => send([ 'output', message.toString('utf8') ]))
        terminal.on('close', () => send([ 'closed' ]))
    }

    const write = (client, input) => {
        console.log(input)
        client.terminal.stdin.write(`${input}\n`)
    }

    ws.on('connection', client =>
        client.on('message', unparsed => {
            const [ event, message ] = JSON.parse(unparsed) 

            switch (event) {
                case 'spawn':
                    return terminal(client, message)

                case 'write':
                    return write(client, message)
            }
        })
    )
}