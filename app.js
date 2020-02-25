require('dotenv').config()

const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const siofu = require('socketio-file-upload')
const logger = require('morgan')
const router = require('./routes/index')
const cors = require('cors')
const mongoose = require('mongoose')
const errorHandler = require('./middlewares/errorHandler')

app.use(cors())
app.use(logger('dev'))
mongoose.connect('mongodb://localhost/musichub-' + process.env.NODE_ENV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// siofu file upload
app.use(siofu.router)
io.on('connection', function(socket) {
  const uploader = new siofu()
  uploader.dir = '../uploadedTracks'
  uploader.listen(socket)

  app.use((req, res, next) => {
    req.socket = socket
    next()
  })
  app.use('/', router)

  app.use('/', errorHandler)
})

module.exports = server
