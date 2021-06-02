const express = require('express')
const path = require('path')
const fs = require('fs')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('colors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
// const errorHandler = require('./middleware/error')
// Load .env
// const dotenvConf = dotenv.config({ path: './backend/config/.env' })
// if (dotenvConf.error) throw dotenvConf.error

const PORT = process.env.PORT || 5005

const app = express()

// Init socket.io
const http = require('http').createServer(app)
const io = require('socket.io')(http)
require('./websocket').init(io)

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
// app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan(process.env.NODE_ENV === 'dev' ? 'dev' : 'common'))
app.use(xss())
app.use(hpp())

// Limit requests to 1000 per minutes
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
})
app.use(limiter)

// Mount API routes
// app.use('/api/v1/session', require('./routes/session'))

//
// Front-end
//

// Set static folder
app.use(express.static(path.join(__dirname, '..', 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

// app.get('/api', (req, res) => {
//   res.sendFile(path.join(__dirname, 'api.html'))
// })

// Error handler
// app.use(errorHandler)

// Start server
const server = http.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.yellow.bold)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`.red)
  // Close server and exit process
  server.close(() => process.exit(1))
})
