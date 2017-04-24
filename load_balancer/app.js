const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(8080);

const api = require('./api')

app.get('/', function (req, res) {
  res.send('hello world')
})

io.on('connection', function (socket) {
  console.log(socket.id)
  console.log('connected')
  socket.emit('news', { hello: 'world' })
  socket.on('path', function (data, fn) {
    console.log(data)
    fn('your tasks')
  })
})