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


const clients = []
io.on('connection', socket => {
  clients.push(socket.id)

  socket.on('disconnect', () => {
    clients.splice(clients.indexOf(socket.id), 1)
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

    return api.getTasks(user_id)
      .then(tasks => fn({
        status: 1,
        error: 0,
        tasks: tasks
      }))
      .catch(error => fn({
        status: 0,
        error: 1,
        message: error
      }))
  })

  socket.on('count_online_users', (fn) => {
  	return fn(clients)
  })


  socket.on('task_done', (data, fn) => {
    const { id, user_id } = data
    return api.successTask(user_id, id)
      .then(r => fn(r))
      .catch(e => fn(e))
  })

  socket.on('task_failed', (data, fn) => {
    const { id, user_id } = data
    return api.errorTask(user_id, id)
      .then(r => fn(r))
      .catch(e => fn(e))
  })
})