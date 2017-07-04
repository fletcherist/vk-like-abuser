const DB = require('./db')
const db = new DB().db

const { getUsers } = require('./firebase-api/users')
const delay = require('../funcs/delay')

module.exports.getUserServer = async function (userId) {
  if (!userId) return false
  const snapshot = await db.ref(`/users/${userId}/server`).once('value')
  const server = snapshot.val()
  return server
}

module.exports.setUserServer = async function (userId, server) {
  if (!userId || !server) return false
  return await db.ref(`/users/${userId}/server`).transaction(currentValue => server)
}

module.exports.getServers = async function () {
  const snapshot = await db.ref('/servers').once('value')
  const servers = snapshot.val()
  return servers
}

