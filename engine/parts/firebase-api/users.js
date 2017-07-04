const DB = require('../db')
const db = new DB().db

async function getUsers () {
  const snapshot = await db.ref('/users').once('value')
  const users = snapshot.val()
  return Object.values(users)
}

async function getUser (userId) {
  if (!userId) return false
  const snapshot = await db.ref('/users/${userId}').once('value')
  const user = snapshot.val()
  return user
}


module.exports = {
  getUsers,
  getUser
}