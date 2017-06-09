const db = require('./firebase').db

// const exchanger = require('./exchanger')

const getUserToExchangeLikes = require('./exchanger/getUserToExchangeLikes')

const getTasks = user_id => {
  return new Promise((resolve, reject) => {
    if (!user_id) return reject('No user id')

    db.ref(`/tasks/${user_id}`).once('value', snap => {
      const tasks = snap.val()
      return resolve(tasks)
    })
  })
}


module.exports = {
  getTasks,
  getUserToExchangeLikes
}