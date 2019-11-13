import css from './index.sass'
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

export default () => {
    const [open, setOpen] = useState(false)
    const [ws] = useState(new WebSocket( `ws://${window.location.hostname}:${process.env.WEBSOCKET_PORT}`))
    const [renderedLog, setLog] = useState('')
    const [rawInput, setRawInput] = useState([])
    const [renderedInput, setInput] = useState('')
    const [clearEvent, setClearEvent] = useState(false)

    const log = []
    let input = []

    const send = (...data) => {
        ws.send(JSON.stringify(data))
    }

    const write = data => {
        send('write', data)
    }

    useEffect( () => {
        ws.onopen = () => setOpen(true)
        
        ws.onmessage = ({ data }) => {
            const [event, message] = JSON.parse(data)

            switch (event) {
                case 'output':
                    log.push(message)
                    setLog(log.join(''))
                    break
            }
        }
    }, [])

    useEffect( () => {
        if (open) send('spawn', { type: 'cmd' })
    }, [open])

    useEffect( () => {
        window.onkeydown = ({ keyCode, key }) => {
            event.preventDefault()

            console.log(keyCode, key)

            switch (true) {
                case (keyCode > 47 && keyCode < 91) || keyCode === 32:
                    setRawInput([ ...rawInput, key ])
                    break

                case key === 'Enter':
                    setClearEvent(true)
                    write(rawInput.join(''))
                    break

                case key === 'Backspace':
                    setRawInput(rawInput.slice(rawInput.length - 2))
                    break
            }

            return false
        }
    }, [rawInput])

    useEffect( () => {
        if (clearEvent) {
            setRawInput([])
            setClearEvent(false)
        }

        const input = document.querySelector('input')
        if (!input) return
        input.scrollIntoView()
        input.focus()
    }, [log, clearEvent])

    useEffect( () => {
        setInput(rawInput.join(''))
    }, [rawInput])

    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=PT+Mono&display=swap" rel="stylesheet" /> 
            </Head>

            <pre className={ css.terminal }>
                { renderedLog }{ renderedInput }<span className={ css.cursor }></span>
            </pre>
        </>
    )
}