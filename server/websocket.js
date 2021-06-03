const uuid = require('uuid')

module.exports.init = (io) => {
  // let users =
  const sessions = {}

  io.on('connection', (socket) => {
    const ip = socket.handshake.headers['x-real-ip']
    console.log(`New Connection from ${ip}`)

    let sessionId = undefined

    socket.on('newSession', (callback) => {
      sessionId = uuid.v4()
      const passcode = uuid.v4()

      sessions[sessionId] = {
        passcode,
        socket,
      }

      callback({ id: sessionId, passcode })
    })

    socket.on('joinSession', (data, callback) => {
      const { id, passcode } = data
      sessionId = id

      // Check if session exists
      if (!sessions.hasOwnProperty(id)) return callback({})

      // Check they own the session
      if (sessions[id].passcode === passcode) {
        // Is host
        sessions[id].socket = socket
        callback({ id, passcode })
      } else {
        // Not host
        sessions[id].guest = { socket }
        initGuest()
        callback({ id })
      }
    })

    socket.on('filesOpened', (data) => {
      // TODO send check passcode
      if (!sessions.hasOwnProperty(sessionId)) return

      sessions[sessionId].files = data
      initGuest()
    })

    // send new files to guest
    function initGuest() {
      if (!sessions[sessionId]) return

      if (sessions[sessionId].guest && sessions[sessionId].files) {
        sessions[sessionId].guest.socket.emit(
          'initFiles',
          sessions[sessionId].files.map((file) => {
            return {
              name: file.name,
              content: file.content,
              guestContent: file.guestContent,
            }
          })
        )
      }
    }

    socket.on('updateFile', (data) => {
      const { name, content } = data
      // Check session exists
      if (!sessions.hasOwnProperty(sessionId)) return

      if (sessions[sessionId].files) {
        for (let i = 0; i < sessions[sessionId].files.length; i++) {
          if (sessions[sessionId].files[i].name === name) {
            if (isGuest(sessionId)) {
              sessions[sessionId].files[i].guestContent = content
              const f = sessions[sessionId].files[i]
              const newData = {
                name: f.name,
                content: f.content,
                guestContent: f.guestContent,
              }
              sessions[sessionId].socket.emit('fileChanged', newData)
            } else {
              sessions[sessionId].files[i].content = content
              const f = sessions[sessionId].files[i]
              const newData = {
                name: f.name,
                content: f.content,
                guestContent: f.guestContent,
              }
              sessions[sessionId].guest?.socket.emit('fileChanged', newData)
            }
          }
        }
      }
    })

    function isGuest(sessionId) {
      return !!(sessions[sessionId]?.guest?.socket === socket)
    }
  })
}
