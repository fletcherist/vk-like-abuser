let db = null
setTimeout(() => {
  const DB = require('../db')
  db = new DB().db
}, 5000)

const Console = require('../console')

module.exports.getUsers = async function () {
  const snapshot = await db.ref(`/users`).once('value')
  const users = snapshot.val()
  return Object.values(users)
}

module.exports.getUser = async function (userId) {
  if (!userId) return false
  const snapshot = await db.ref(`/users/${userId}`).once('value')
  const user = snapshot.val()
  return user
}

module.exports.deactivateUser = async function (userId) {
  if (!userId) return false
  new Console().notify(`{deactivateUser}: Deactivating user ${userId}`)
  return await db.ref(`/users/${userId}/`).update({
    idActive: false,
    idValid: false
  })
}
