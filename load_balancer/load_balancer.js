const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(80, () => console.log('Server is started'))

const api = require('./api')

app.get('/exchanger/get_target', (req, res) => {
  console.log(api)

  const user = api.getUserToExchangeLikes()
  return res.json(user)
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