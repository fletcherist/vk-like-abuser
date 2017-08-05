const DB = require('./db')
const {db} = require('./app')

const { getUsers } = require('../api/db/users')
const VKServers = require('../api/vk/servers')

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

async function setServerUsers (serverName, usersCount) {
  if (!serverName || !usersCount) return false
  const serverUsers = db.ref(`/servers/${serverName}/users`)
  await serverUsers.transaction(currentValue => usersCount || 0)
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
    if (clientId === Number(_clientId)) {
      console.log(server)
      return Object.assign(servers[server], {
        name: server
      })
    }
  }
  return false
}

const getServerNameByClientId = _clientId =>
  getServerByClientId(_clientId).name

const updateServersInformation = async function () {
  const { servers } = config

  const VKServersList = await VKServers.getServersInfo()
  try {
    for (const server in servers) {
      const { clientId } = servers[server]
      if (!clientId) continue
      await setServerClientId(server, clientId)

      const currentVKServer = VKServersList.find(_server => clientId === _server.id)
      if (currentVKServer) {
        const { members_count } = currentVKServer
        await setServerUsers(server, members_count)
      }
    }
    console.log('servers information has been updated')
  } catch (e) {
    console.log(e)
  }
}

const getMostRelevantServer = async function () {
  try {
    const snap = await db.ref('/servers').once('value')
    const servers = snap.val()

    const relevantServer = Object.values(servers)
      .reduce((server1, server2) =>
        server1.users < server2.users ? server1 : server2
      )
    return relevantServer
  } catch (e) {
    console.error(e)
    return false
  }
}

getMostRelevantServer()

// updateServersInformation()
// getServers().then(r => console.log(r))

setInterval(updateServersInformation, 36e5)

module.exports = {
  getUserServer,
  getServers,
  setUserServer,
  updateServersInformation,
  setServerClientId,
  incrementServerUsers,
  setServerUsers,

  getServerByClientId,
  getServerNameByClientId,

  getMostRelevantServer
}
