const VKapi = require('node-vkapi')
const { log } = require('../../parts/console')

const api = new VKapi()

async function isPhotoExist (userId, photoId) {
  const photo = await getPhotoById(...arguments)
  if (photo) return true
  return false
}

async function getPhotoById (userId, photoId) {
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

module.exports = {
  isPhotoExist,
  getPhotoById
}