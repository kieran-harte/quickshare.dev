const uuid = require('uuid')

module.exports.init = (io) => {
  // let users =
  const sessions = {}

  io.on('connection', (socket) => {
    const ip = socket.handshake.address
    console.log(`New Connection from ${ip}`)

    let sessionId = undefined

    socket.on('newSession', (callback) => {
      sessionId = uuid.v4()
      const passcode = uuid.v4()

      sessions[sessionId] = {
        passcode,
      }

      callback({ id: sessionId, passcode })
    })

    socket.on('joinSession', (data, callback) => {
      console.log('join', data)
      const { id, passcode } = data

      sessionId = id

      // Check if session exists
      if (!sessions.hasOwnProperty(id)) return callback({})

      // Check they own the session
      if (sessions[id].passcode === passcode) {
        // Is host
        callback({ id, passcode })
      } else {
        // Not host
        callback({ id })
      }
    })

    socket.on('contentChanged', (data) => {
      console.log(data, ip)
    })
  })
}
