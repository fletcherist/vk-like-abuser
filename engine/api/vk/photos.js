const VKapi = require('node-vkapi')
const { log } = require('../../parts/console')

const api = new VKapi()

async function isPhotoExist(userId, photoId) {
  const photo = await getPhotoById(...arguments)
  if (photo) return true
  return false
}

async function getPhotoById(userId, photoId) {
  if (!userId || !photoId) return false

  try {
    const photo = await api.call('photos.getById', {
      photos: `${userId}_${photoId}`
    })

    if (photo.length === 0) return false
    return photo[0]
  } catch (e) {
    return false
  }
}

const getRandomFromArray = array => array[Math.floor(Math.random() * array.length)]
async function getRandomUserPhotoId(userId) {
  if (!userId) throw new Error('No userId provided')
  try {
    const { count, items } = await api.call('photos.get', {
      owner_id: userId,
      album_id: getRandomFromArray(['wall', 'profile']),
      extended: 1,
      rev: 1
    })

    if (count === 0) return null
    return getRandomFromArray(items).id
  } catch (error) {
    return null
  }
}

module.exports = {
  isPhotoExist,
  getPhotoById,
  getRandomUserPhotoId
}
