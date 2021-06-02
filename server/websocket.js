module.exports.init = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected')
  })
}
