const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')

app.use(bodyParser.json())

server.listen(80, () => console.log('Server is started'))


app.get('/', (req, res) => {
  res.send('Hello from VK Like Abuser API.')
})

// @deprecated
// app.get('/exchanger/get_target', (req, res) => {
//   console.log(api)

//   const user = api.getUserToExchangeLikes()
//   return res.json(user)
// })
const { getMostRelevantServer } = require('../parts/servers')
const { getTasks, successTask, errorTask } = require('../parts/tasksToExtension')

app.get('/server', async (req, res) => {
  const server = await getMostRelevantServer()
  res.send({msg: 'we found a relevant server for you!', server: server})
})

app.post('/payments', async (req, res) => {
  console.log(req.body)
})

const parseVKLink = require('../payments/parseVKLink')
app.post('/payments/test', async (req, res) => {
  const { url } = req.body
  if (!url) return res.json({error: 1, msg: "no url"})

  const parsed = parseVKLink(url)
  res.json(parsed)
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

    return getTasks(user_id)
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
    return successTask(user_id, id)
      .then(r => fn(r))
      .catch(e => fn(e))
  })

  socket.on('task_failed', (data, fn) => {
    const { id, user_id } = data
    return errorTask(user_id, id)
      .then(r => fn(r))
      .catch(e => fn(e))
  })
})