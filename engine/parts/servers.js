const DB = require('./db')
const db = new DB().db

const { getUsers } = require('../api/db/users')
const delay = require('../funcs/delay')
const config = require('../config')

async function getUserServer (userId) {
  if (!userId) return false
  const snapshot = await db.ref(`/users/${userId}/server`).once('value')
  const server = snapshot.val()
  return server
}

async function setUserServer (userId, server) {
  if (!userId || !server) return false
  return await db.ref(`/users/${userId}/server`).transaction(currentValue => server)
}

async function getServers () {
  const snapshot = await db.ref('/servers').once('value')
  const servers = snapshot.val()
  return servers
}

async function setServerClientId (serverName, clientId) {
  if (!clientId || !serverName) return 'Not enough data'
  const server = db.ref(`/servers/${serverName}`)
  const serverObject = await server.once('value')
  if (!serverObject) return `No server with this name (${serverName})`

  await server.update({clientId})
}

async function incrementServerUsers (serverName) {
  if (!serverName) return false
  const serverUsers = db.ref(`/servers/${serverName}/users`)
  await serverUsers.transaction(currentValue => (currentValue + 1) || 0)
}

const getServerByClientId = _clientId => {
  if (!_clientId) return false
  const { servers } = config
  for (const server in servers) {
    const { clientId } = servers[server]
    if (!clientId) continue
    if (clientId === Number(_clientId)) return server
  }
  return false
}

const updateServersInformation = async function () {
  const { servers } = config
  for (const server in servers) {
    const { clientId } = servers[server]
    if (!clientId) continue
    await setServerClientId(server, clientId)
  }

  console.log('servers information has been updated')
}

// updateServersInformation()
// getServers().then(r => console.log(r))

module.exports = {
  getUserServer,
  getServers,
  setUserServer,
  updateServersInformation,
  setServerClientId,
  incrementServerUsers,
  getServerByClientId
}
