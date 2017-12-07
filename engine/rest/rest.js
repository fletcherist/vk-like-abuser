const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')

const {
  VK_LIKE_ABUSER_PAYMENT_CONFIRMATION_TOKEN
} = require('../config')

app.use(bodyParser.json())

const PORT = 80
server.listen(PORT, () => console.log(`Server is started on port ${PORT}`))

app.get('/', (req, res) => {
  res.send('Hello from VK Like Abuser API.')
})

const { getMostRelevantServer } = require('../parts/servers')
const { getTasks, successTask, errorTask } = require('../parts/tasksToExtension')
const parseVKLink = require('../payments/parseVKLink')
const processingPaymentTask = require('../payments/payments').processing
const doPaymentTask = require('../payments/payments').doPaymentTask

app.get('/server', async (req, res) => {
  const server = await getMostRelevantServer()
  res.send({msg: 'we found a relevant server for you!', server: server})
})

app.post('/payments/test', async (req, res) => {
  const { url } = req.body
  if (!url) return res.json({error: 1, msg: 'no url'})

  try {
    const parsed = parseVKLink(url)
    res.json(parsed)
  } catch (error) {
    console.error(error)
    res.send({
      msg: 'Unexpected error'
    })
  }
})

app.post('/payments/create', async (req, res) => {
  const { url, taskSignature, ownerUserId } = req.body
  if (!url) return res.json({ status: 'error', msg: '{url} wasn`t sent' })
  if (!taskSignature) res.json({ status: 'error', msg: '{taskSignature} wasn`t sent' })
  if (!ownerUserId) res.json({ status: 'error', msg: '{ownerUserId} wasn`t sent' })

  const paymentTask = await processingPaymentTask({url, taskSignature, ownerUserId})

  console.log(url, taskSignature, paymentTask)
  return res.json({
    status: 'success',
    url: url,
    paymentTaskId: Object.keys(paymentTask)[0]
  })
})

app.get(`/payments/confirm/${VK_LIKE_ABUSER_PAYMENT_CONFIRMATION_TOKEN}/:paymentTaskId`, async (req, res) => {
  const paymentTaskId = req.params.paymentTaskId
  console.log('CONFIRMATION REQUESTED SUCCESSFULLY', paymentTaskId)
  doPaymentTask(paymentTaskId)

  return res.send({
    msg: `task (${paymentTaskId}) confirmed. Lets abuse now`
  })
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
