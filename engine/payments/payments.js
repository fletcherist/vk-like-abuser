const fetch = require('node-fetch')
const firebase = require('firebase')

const { db } = require('../parts/app')

const { isWallpostExist } = require('../api/vk/wall')
const { isPhotoExist } = require('../api/vk/photos')
const delay = require('../funcs/delay')

const { parseVKLink } = require('./parseVKLink')

async function isItemExist ({type, userId, itemId}) {
  if (!type || !userId || !itemId) return false
  switch (type) {
    case 'photo': return await isPhotoExist(userId, itemId)
    case 'post': return await isWallpostExist(userId, itemId)
    case 'groupPost': return await isWallpostExist(userId, itemId)
    default:
      console.error('something went wrong!')
      return false
  }
}

async function foo () {
  const links = [
    'https://vk.com/fletcherist?z=photo96170043_456239376%2Fphotos96170043',
    // 'https://vk.com/fletcherist?w=wall96170043_3051',
    // 'https://vk.com/tech?w=wall-147415323_713',
    // 'https://vk.com/vkcup?w=wall-41208167_1250'
  ]

  const parsedLinks = links.map(link => parseVKLink(link))
  for (const item of parsedLinks) {
    await delay(1000)
    console.log(await isItemExist(item))
  }
}

// foo()

async function processing ({url, ownerUserId}) {

  const parsedLink = await parseVKLink(url)
  if (!await isItemExist(parsedLink)) {
    console.log('This item is not exist')
    return false
  }

  const { type, userId, itemId } = parsedLink
  // createPaymentTask({type, userId, itemId, ownerUserId})

  // findPaymentTask({userId, itemId})

  const task = await new PaymentTask('-Kp5Ts83L6f2rB7rN3z9')
  // task.setStatus(STATUSES.DONE)
  // task.setTimestamp(STATUSES.DONE)
  // const _task = task.get()
  // console.log(_task)

}

processing({
  url: 'https://vk.com/fletcherist?z=photo96170043_456239376%2Fphotos96170043',
  ownerUserId: '5'
})

async function createPaymentTask ({
  type,
  userId,
  itemId,
  ownerUserId
}) {
  const task = await db.ref('/payments').push({
    type,
    userId,
    itemId,
    ownerUserId,
    timestamps: {
      created: firebase.database.ServerValue.TIMESTAMP,
      waitingPayment: null,
      inProgress: null,
      done: null,
      failed: null
    },
    status: 'created'
  })

  console.log(task)
  return task
}

async function findPaymentTask ({
  userId,
  itemId
}) {
  const taskSnapshot = await db.ref('/payments')
    .orderByChild('userId')
    .equalTo(userId)
    .limitToLast(1)
    .once('value')

  const task = taskSnapshot.val()
  console.log(task)
}

const STATUSES = {
  CREATED: 'created',
  WAITING_PAYMENT: 'waitingPayment',
  IN_PROGRESS: 'inProgress',
  DONE: 'done',
  FAILED: 'failed'
}

class PaymentTask {
  constructor (taskId) {
    if (!taskId) return false
    this.taskId = taskId
    this.path = `/payments/${this.taskId}`
    this.task = null

    return this
  }

  async get () {
    this.task = (await db.ref(this.path).once('value')).val()
    return this.task
  }

  _checkStatus (status) {
    if (!status) return false
    // If status is not in the list of available statuses
    // it seems to be an error
    if (!Object.values(STATUSES).includes(status)) return false

    return true
  }

  async setStatus (status) {
    if (!this._checkStatus(status)) return false
    

    await db.ref(`${this.path}/status`)
      .transaction(currentStatus => status)
  }

  async setTimestamp (status) {
    if (!this._checkStatus(status)) return false

    await db.ref(`${this.path}/timestamps/${status}`)
      .transaction(currentTimestamp => firebase.database.ServerValue.TIMESTAMP)
  }
}

module.exports = {
  parseVKLink,
  createPaymentTask,
  PaymentTask
}