const _log = require('../../parts/console').log
const { db } = require('../../parts/app')
const { random } = require('lodash')

async function getUsers(limit = 1000) {
  const snapshot = await db.ref(`/users`).limitToLast(limit).once('value')
  const users = snapshot.val()
  return users
}

async function getActiveUsers() {
  const snapshot = await db.ref(`/users`)
    .orderByChild('isActive')
    .equalTo(true)
    .once('value')
  const users = snapshot.val()
  return users
}

async function getInactiveUsers(limit = 100) {
  const snapshot = await db.ref(`/users`)
    .orderByChild('isActive')
    .equalTo(false)
    .limitToLast(limit)
    .once('value')
  const users = snapshot.val()
  return users
}

async function getUser(userId) {
  if (!userId) return false
  const snapshot = await db.ref(`/users/${userId}`).once('value')
  const user = snapshot.val()
  return user
}

async function isUserExist(userId) {
  if (!userId) return false
  const user = await getUser(userId)
  if (user) return true
  return false
}

async function deactivateUser(userId) {
  if (!userId) return false
  console.log(`{deactivateUser}: Deactivating user ${userId}`)
  return await db.ref(`/users/${userId}/`).update({
    isActive: false,
    isValid: false
  })
}

async function activateUser(userId) {
  if (!userId) return false
  console.log(`{deactivateUser}: Activating user ${userId}`)
  return await db.ref(`/users/${userId}`).update({
    isActive: true,
    isValid: true
  })
}

async function getRandomUser() {
  const randomLimit = random(1, 5)
  const users = Object.values(await getUsers(randomLimit))

  const randomIndex = random(0, users.length - 1)
  const randomUser = users[randomIndex]

  return randomUser
}

async function removeUser(userId) {
  if (!userId) return false
  await db.ref(`/users/${userId}`).remove()
}

module.exports = {
  getUsers,
  getActiveUsers,
  getInactiveUsers,
  getUser,
  isUserExist,
  removeUser,

  deactivateUser,
  activateUser,
  getRandomUser
}
