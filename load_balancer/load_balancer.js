const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(80, () => console.log('Server is started'))

const api = require('./api')


app.get('/', (req, res) => {
  res.send('Hello from VK Like Abuser API.')
})
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

  socket.on('get_tasks', (data, fn) => {
    const { user_id } = data
    if (!user_id) {
      return fn({
        status: 0,
        error: 1,
        message: 'User id is not provided'
      })
    }

    return fn({
      status: 1,
      error: 0,
      tasks: [1,2,3,4,5,6]
    })
  })
})