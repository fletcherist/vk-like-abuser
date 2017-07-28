const _log = require('../../parts/console').log
const { db } = require('../../parts/app')
const { random } = require('lodash')

async function getUsers (limit) {
  if (!limit) limit = 10000
  const snapshot = await db.ref(`/users`).limitToLast(limit).once('value')
  const users = snapshot.val()
  return users
}

async function getUser (userId) {
  if (!userId) return false
  const snapshot = await db.ref(`/users/${userId}`).once('value')
  const user = snapshot.val()
  return user
}

async function isUserExist (userId) {
  if (!userId) return false
  const user = await getUser(userId)
  if (user)
    return true
  return false
}

async function deactivateUser (userId) {
  if (!userId) return false
  console.log(`{deactivateUser}: Deactivating user ${userId}`)
  return await db.ref(`/users/${userId}/`).update({
    isActive: false,
    isValid: false
  })
}

async function activateUser (userId) {
  if (!userId) return false
  console.log(`{deactivateUser}: Activating user ${userId}`)
  return await db.ref(`/users/${userId}`).update({
    isActive: true,
    isValid: true
  })
}

async function getRandomUser () {
  const randomLimit = random(1, 5)
  const users = Object.values(await getUsers(randomLimit))

  const randomIndex = random(0, users.length - 1)
  const randomUser = users[randomIndex]

  return randomUser
}

module.exports = {
  getUsers,
  getUser,
  isUserExist,

  deactivateUser,
  activateUser,
  getRandomUser
}