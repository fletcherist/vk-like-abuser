const _log = require('../../console').log
const {db} = require('../../app')
const {random} = require('lodash')

async function getUsers (limit) {
  if (!limit) limit = 1000
  const snapshot = await db.ref(`/users`).limitToFirst(limit).once('value')
  const users = snapshot.val()
  return Object.values(users)
}

async function getUser (userId) {
  if (!userId) return false
  const snapshot = await db.ref(`/users/${userId}`).once('value')
  const user = snapshot.val()
  return user
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
  const users = await getUsers(randomLimit)

  const randomIndex = random(0, users.length - 1)
  const randomUser = users[randomIndex]

  return randomUser
}

module.exports = {
  getUsers,
  getUser,
  deactivateUser,
  activateUser,
  getRandomUser
}