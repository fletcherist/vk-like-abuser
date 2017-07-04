const VKapi = require('node-vkapi')
const Console = require('../console')

async function checkUserDeactivated (id) {
  if (!id) return new Console().error(`{${checkUserDeactivated.name}}: id is not provided`)

  const vkapi = new VKapi()
  const result = await vkapi.call('users.get', {user_ids: id})

  if (result && result.length !== 0) {
    const user = result[0]
    if (user.deactivated === 'banned') {
      return true
    }

    return false
  }

  new Console().error(`{${checkUserDeactivated.name}}: can't get ${id}`)
  return false
}

module.exports = {
  checkUserDeactivated
}