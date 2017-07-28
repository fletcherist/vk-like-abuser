const VKapi = require('node-vkapi')
const { log } = require('../../parts/console')

const api = new VKapi()

async function isWallpostExist (userId, postId) {
  const wallpost = await getWallpostById(...arguments)
  if (wallpost) return true
  return false
}

async function getWallpostById (userId, postId) {
  if (!userId || !postId) return false

  try {
    const wallpost = await api.call('wall.getById', {
      posts: `${userId}_${postId}`
    })
    
    if (wallpost.length === 0) return false
    return wallpost[0]
  } catch (e) {
    return false
  }
}

module.exports = {
  isWallpostExist,
  getWallpostById
}