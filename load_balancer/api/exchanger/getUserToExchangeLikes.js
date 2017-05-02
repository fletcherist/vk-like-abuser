const db = require('../firebase').db
const _ = require('lodash')
const fs = require('fs')

let users = []

const getUserToExchangeLikes = user_id => {
  if (users.length === 0) {
    return false
  }

  let randomUser = users[_.random(0, users.length)]

  const {
    photo_100,
    username,
    isActive,
    id
  } = randomUser
  if (!photo_100 || !username || !isActive) {
    return getUserToExchangeLikes(user_id)
  }

  if (randomUser.id === user_id) {
    return getUserToExchangeLikes(user_id)
  }

  return {
    photo_100, username, isActive, id
  }
}

const getUsersFromDB = () => {
  return new Promise((resolve, reject) => {
    db.ref('/users').once('value', snap => {
      if (snap) {
        users = _.toArray(snap.val())
        cacheUsers(users)
        return resolve()
      } else {
        return reject()
      }
    })
  })
}

const getUsersFromCache = () => {
  const json = fs.readFileSync(__dirname + '/cachedUsers.json', 'utf-8')
  let _users = {}
  try {
    _users = JSON.parse(json)
  } catch (e) {
    getUsersFromDB()
  }
  return _users
}

const cacheUsers = () => {
  console.log('Caching users...')
  fs.writeFile(__dirname + '/cachedUsers.json', JSON.stringify(users, null, 2), () => {})
}

users = getUsersFromCache()

module.exports = getUserToExchangeLikes