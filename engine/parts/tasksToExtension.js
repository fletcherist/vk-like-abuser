const firebase = require('firebase')
const Console = require('./console')
const {db} = require('./app')

/*
  object: id,
  target: id,
  item: id,
  status: 0 || 1

  (0 - not done yet)
  (1 - done successfully)
  (2 - recieved, problem while doing)
*/
class TasksToExtension {
  constructor () {
    // Do not move to the top of the file
    // While refactoring — doesn't working
    const DB = require('./db')
    const GlobalStats = require('./globalStats')
    
    this.db = new DB()
    new GlobalStats().incrementTasksCount()
  }

  add ({object, target, item}) {
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
        status: 0,
      })

      return new Console().notify('{TasksToExtension} task was pushed')
    }
    return new Console().error('{TasksToExtension} Error has occured while creating task')
  }
  check () {

  }
}

const getTasks = user_id => {
  return new Promise((resolve, reject) => {
    if (!user_id) return reject('No user id')

    db.ref(`/tasks/${user_id}`).limitToFirst(5).once('value', snap => {
      const tasks = snap.val()
      return resolve(tasks)
    })
  })
}

const successTask = (user_id, id) => {
  return new Promise((resolve, reject) => {
    if (!user_id) return reject('No user id')
    if (!id) return reject('No task id')

    db.ref(`/tasks/${user_id}/${id}/status`)
      .transaction(status => 1)

    return resolve({status: 1, message: 'success'})
  })
}

const errorTask = (user_id, id) => {
  return new Promise((resolve, reject) => {
    if (!user_id) return reject('No user id')
    if (!id) return reject('No task id')

    db.ref(`/tasks/${user_id}/${id}/status`)
      .transaction(status => 2)

    return resolve({status: 1, message: 'success'})
  })
}

module.exports = TasksToExtension

module.exports.getTasks = getTasks
module.exports.successTask = successTask
module.exports.errorTask = errorTask
