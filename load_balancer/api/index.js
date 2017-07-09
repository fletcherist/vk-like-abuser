const db = require('./firebase').db

// const exchanger = require('./exchanger')
const servers = require('./servers')

const getUserToExchangeLikes = require('./exchanger/getUserToExchangeLikes')

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

module.exports = {
  getTasks,
  getUserToExchangeLikes,
  successTask,
  errorTask,

  servers
}