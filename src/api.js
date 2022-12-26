import { connect } from 'socket.io-client'


function getEnv(name) {
    let value = process.env[name]
    if (!value) {
        let error = Error('missing environment variable: ' + name)
        document.body.innerText = error.message
        throw error
    }
    return value
}

export let API_ORIGIN = getEnv('REACT_APP_API_SERVER')

export function connectSocketIO() {
    return connect(API_ORIGIN)
}
