const VKapi = require('node-vkapi')
const { log } = require('../../parts/console')
const config = require('../../config')
const { getServerByClientId } = require('../../parts/servers')

const api = new VKapi()

async function getServerById (clientId) {
  const { client_secret } = getServerByClientId(clientId)

  const appVK = new VKapi({
    app: {
      id: clientId,
      secret: client_secret
    }
  })

  try {
    const { access_token } = appVK.auth.server()
    const server = await appVK.call('apps.get', {
      app_id: clientId,
      access_token,
      client_secret
    })

    if (server.items && server.items.length > 0) {
      return server.items[0]
    }
  } catch (e) {

  }
}

async function getServersInfo () {
  const { servers } = config
  const serversStr = Object.values(servers)
    .map(server => server.clientId)
    // Make it unique
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(',')

  try {
    const serversResponse = await api.call('apps.get', {app_ids: serversStr})
    if (serversResponse.items) {
      return Object.values(serversResponse.items)
    }
    return []
  } catch (e) {

  }
}

module.exports = {
  getServerById,
  getServersInfo
}