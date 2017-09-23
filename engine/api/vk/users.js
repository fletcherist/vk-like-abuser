const VKapi = require('node-vkapi')
const { log } = require('../../parts/console')

const api = new VKapi()

async function getUser(id) {
  if (!id) {
    return false
  }

  let result
  try {
    result = await api.call('users.get', {user_ids: id})
  } catch (e) {
    return false
  }
  if (result && result.length !== 0) {
    const user = result[0]
    return user
  }

  return false
}

async function checkUserDeactivated(id) {
  if (!id) return false

  const user = await getUser(id)
  if (!user) return false
  if (user.deactivated === 'banned') {
    return true
  }

  return false
}

module.exports = {
  getUser,
  checkUserDeactivated
}
