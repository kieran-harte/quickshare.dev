const uuid = require('uuid')

module.exports.init = (io) => {
  // let users =

  io.on('connection', (socket) => {
    const ip = socket.handshake.address
    console.log(`New Connection from ${ip}`)

    let sessionId = undefined

    socket.on('newSession', (callback) => {
      sessionId = uuid.v4()
      callback({ id: sessionId })
    })

    socket.on('rehostSession', (data, callback) => {
      console.log('rehost', data.id)
      // TODO check that they are the host
      sessionId = data.id
      callback({ id: sessionId })
    })

    socket.on('joinSession', (data) => {
      // TODO connect to session
    })

    socket.on('contentChanged', (data) => {
      console.log(data, ip)
    })
  })
}
