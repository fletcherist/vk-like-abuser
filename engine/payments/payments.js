// const fetch = require('node-fetch')
const firebase = require('firebase')

const { db } = require('../parts/app')

const { isWallpostExist } = require('../api/vk/wall')
const { isPhotoExist } = require('../api/vk/photos')
// const delay = require('../funcs/delay')
const delay = require('../funcs/delay')
const shuffleArray = require('../funcs/shuffleArray')
const { getActiveUsers, getUser } = require('../api/db/users')
const VK = require('../parts/vk')

const parseVKLink = require('./parseVKLink')

const STATUSES = Object.freeze({
  CREATED: 'created',
  WAITING_PAYMENT: 'waitingPayment',
  IN_PROGRESS: 'inProgress',
  DONE: 'done',
  FAILED: 'failed'
})

async function isItemExist({type, userId, itemId}) {
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

async function processing({url, ownerUserId, taskSignature}) {
  const parsedLink = await parseVKLink(url)
  if (!await isItemExist(parsedLink)) {
    console.log('This item is not exist')
    return false
  }

  const { type, userId, itemId } = parsedLink
  const task = await findOnlyActivePaymentTask({userId, itemId})
  if (task) {
    console.log('Already created', task)
    return task
  }

  const paymentTask = await createPaymentTask({type, userId, itemId, ownerUserId, taskSignature})
  return paymentTask
}

const TASK_SIGNATURES = {
  '01': { amount: 50, price: 19 },
  '02': { amount: 100, price: 39 },
  '03': { amount: 500, price: 149 }
}

async function doPaymentTask(paymentTaskId) {
  const task = await new PaymentTask(paymentTaskId)
  const { userId, itemId, status, taskSignature, type } = await task.get()
  if ([STATUSES.DONE, STATUSES.FAILED].includes(status)) {
    console.log('Payment Task: already done or failed', userId, itemId)
    return false
  }

  await task.setStatus(STATUSES.IN_PROGRESS)
  await task.setTimestamp(STATUSES.IN_PROGRESS)

  let needed = TASK_SIGNATURES[taskSignature].amount + 20 || 50
  let done = 0
  let currentUserIndex = 0

  console.log('Payment Task: started', userId, itemId, `${needed} likes`)

  let users = await getActiveUsers()
  let usersArray = shuffleArray(Object.values(users))

  const targetUser = await getUser(userId)

  while (needed !== 0) {
    await delay(500)

    const currentUser = usersArray[currentUserIndex]
    try {
      const vk = new VK(currentUser.access_token)
      await vk.like({target: userId, id: itemId, type: type})

      done++
      needed--
      currentUserIndex++
      console.log('Payment Task: success', currentUser.id, itemId)
    } catch (error) {
      console.error('Payment Task: error', error)
      currentUserIndex++
      continue
    }

    task.incrementProgress()
    task.pushRealtimeLike(currentUser, targetUser, itemId)
  }

  await task.setStatus(STATUSES.DONE)
  await task.setTimestamp(STATUSES.DONE)

  return paymentTaskId
}

async function createPaymentTask({
  type,
  userId,
  itemId,
  ownerUserId,
  taskSignature
}) {
  const task = await db.ref('/payments').push({
    type,
    userId,
    itemId,
    ownerUserId,
    taskSignature,
    timestamps: {
      created: firebase.database.ServerValue.TIMESTAMP,
      waitingPayment: null,
      inProgress: null,
      done: null,
      failed: null
    },
    status: STATUSES.WAITING_PAYMENT,
    progress: 0
  })

  console.log(task)
  return task
}

async function findPaymentTask({
  userId,
  itemId
}) {
  const taskSnapshot = await db.ref('/payments')
    .orderByChild('itemId')
    .equalTo(itemId)
    .limitToLast(1)
    .once('value')

  const task = taskSnapshot.val()
  console.log(task)
  return task
}

// if task is done, returns null
async function findOnlyActivePaymentTask({
  userId,
  itemId
}) {
  const task = await findPaymentTask({userId, itemId})
  if (task && Object.values(task)[0].status === STATUSES.DONE) {
    return null
  }
  return task
}

class PaymentTask {
  constructor(taskId) {
    if (!taskId) return false
    this.taskId = taskId
    this.path = `/payments/${this.taskId}`
    this.task = null

    return this
  }

  async get() {
    this.task = (await db.ref(this.path).once('value')).val()
    return this.task
  }

  _checkStatus(status) {
    if (!status) return false
    // If status is not in the list of available statuses
    // it seems to be an error
    if (!Object.values(STATUSES).includes(status)) return false

    return true
  }

  async setStatus(status) {
    if (!this._checkStatus(status)) return false

    await db.ref(`${this.path}/status`)
      .transaction(currentStatus => status)
  }

  async setTimestamp(status) {
    if (!this._checkStatus(status)) return false

    await db.ref(`${this.path}/timestamps/${status}`)
      .transaction(currentTimestamp => firebase.database.ServerValue.TIMESTAMP)
  }

  async incrementProgress() {
    await db.ref(`${this.path}/progress`)
      .transaction(currentProgress => currentProgress + 1)
  }

  async pushRealtimeLike(objectUser, targetUser, item) {
    const DEFAULT_PHOTO_100 = 'http://vk.com/images/camera_a.gif'
    await db.ref(`${this.path}/realtime_likes`).push({
      object: {
        photo_100: objectUser.photo_100 || DEFAULT_PHOTO_100,
        id: objectUser.id
      },
      target: {
        photo_100: targetUser ? targetUser.photo_100 : DEFAULT_PHOTO_100,
        id: targetUser ? targetUser.id : 0
      },
      item: item
    })
  }
}

module.exports = {
  parseVKLink,
  createPaymentTask,
  doPaymentTask,
  processing,
  PaymentTask
}
