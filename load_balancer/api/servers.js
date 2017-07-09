const db = require('./firebase').db

const getMostRelevantServer = async function () {
  try {
    const snap = await db.ref('/servers').once('value')
    const servers = snap.val()

    let minUsers = 0
    let relevantServer = null

    for (const server in servers) {
      const { users } = servers[server]
      if (users <= minUsers) {
        relevantServer = server
        minUsers = users
      }
    }

    return servers[relevantServer]
  } catch (e) {
    console.error(e)
    return false
  }
}

module.exports = {
  getMostRelevantServer
}