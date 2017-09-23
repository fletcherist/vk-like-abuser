const firebase = require('firebase')
const Console = require('./console')
const { db } = require('./app')
const { getInactiveUsers } = require('../api/db/users')
const { getRandomUserPhotoId } = require('../api/vk/photos')
const delay = require('../funcs/delay')
const runEvery = require('../funcs/runEvery')
const shuffleArray = require('../funcs/shuffleArray')
const { fpQueueTaskAlgorithm } = require('../algorithms')

const ONE_DAY = 864e5

/*
  object: id,
  target: id,
  item: id,
  status: 0 || 1

  (0 - not done yet)
  (1 - done successfully)
  (2 - recieved, problem while doing)
*/

const setDeadlineForDays = (days = 14) => Date.now() + ONE_DAY * days

class TasksToExtension {
  constructor() {
    // Do not move to the top of the file
    // While refactoring — doesn't working
    const DB = require('./db')
    const GlobalStats = require('./globalStats')

    this.db = new DB()
    new GlobalStats().incrementTasksCount()
  }

  add({object, target, item}) {
    this.object = object
    this.target = target
    this.item = item

    console.warn(this.object, this.target, this.item)

    if (this.object && this.target && this.item) {
      this.db.db.ref(`/tasks/${this.object}`).push({
        object: this.object,
        target: this.target,
        item: this.item,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        deadline: setDeadlineForDays(14),
        status: 0
      })

      return new Console().notify('{TasksToExtension} task was pushed')
    }
    return new Console().error('{TasksToExtension} Error has occured while creating task')
  }

  check() {

  }
}

// const isDeadlineComes = deadline => Date.now() > Number(deadline)
// const isTaskFailed = task => isDeadlineComes(task.deadline) && task.status === 0

const createRandomTasks = async (number = 10) => {
  new Console().notify(`{createRandomTasks} creating ${number} tasks`)
  let inactiveUsers = await getInactiveUsers(number)
  /* you can't create task for yourself */
  inactiveUsers = Object.values(inactiveUsers)
    .filter(user => Boolean(user.createdAt))
    .sort((a, b) => a.createdAt > b.createdAt)
    .reverse()
  const tasksList = fpQueueTaskAlgorithm(inactiveUsers)
  for (const task of tasksList) {
    const { object, target } = task
    await delay(5000)
    const item = await getRandomUserPhotoId(target)
    new TasksToExtension().add({object, target, item})
  }

  new Console().notify('{createRandomTasks} tasks were created')
}

runEvery(864e5, createRandomTasks.bind(null, 1000))

const getTasks = userId => {
  return new Promise((resolve, reject) => {
    if (!userId) return reject(new Error('No user id'))

    db.ref(`/tasks/${userId}`).limitToFirst(5).once('value', snap => {
      const tasks = snap.val()
      return resolve(tasks)
    })
  })
}

const successTask = (userId, id) => {
  return new Promise((resolve, reject) => {
    if (!userId) return reject(new Error('No user id'))
    if (!id) return reject(new Error('No task id'))

    db.ref(`/tasks/${userId}/${id}/status`)
      .transaction(status => 1)

    return resolve({status: 1, message: 'success'})
  })
}

const errorTask = (userId, id) => {
  return new Promise((resolve, reject) => {
    if (!userId) return reject(new Error('No user id'))
    if (!id) return reject(new Error('No task id'))

    db.ref(`/tasks/${userId}/${id}/status`)
      .transaction(status => 2)

    return resolve({status: 1, message: 'success'})
  })
}

module.exports = TasksToExtension

module.exports.getTasks = getTasks
module.exports.successTask = successTask
module.exports.errorTask = errorTask
