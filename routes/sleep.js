const { exec } = require('child_process')

module.exports = async ({ res }) => {
    exec('powercfg -hibernate off\n')
    exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0\n')
    res.json({ success: true })
}