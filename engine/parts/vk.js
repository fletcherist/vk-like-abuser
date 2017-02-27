const VKApi = require('node-vkapi')
const Console = require('./console')

class VK {
  constructor (access_token) {
    if (!access_token) return new Console().error('{VK} No access token provided')
    this.vk = new VKApi({
      token: access_token
    })
  }

  getUser (user_ids) {
    return new Promise((resolve, reject) => {
      this.vk.call('users.get', {
        user_ids: user_ids,
        fields: ['photo_50', 'photo_100']
      }).then(res => {
        if (res.length > 0) res = res[0]
        return resolve(res)
      })
      .catch(e => {
        return reject(e)
      })
    })
  }

  like ({target, id, type}) {
    if (!target) return new Console().error('{VK} no target')
    if (!id) return new Console().error('{VK} no id')

    return new Promise ((resolve, reject) => {
      this.vk.call('likes.add', {
        type: 'photo',
        owner_id: target,
        item_id: id
      }).then(res => {
        return resolve()
      })
      .catch(e => {
        reject(e)
      })
    })
  }

  getWall (user_id) {

  }

  getPhotos (user_id) {
    const types = ['wall', 'profile']
    const typeToSearch = types[Math.floor(Math.random() * types.length)]

    return new Promise ((resolve, reject) => {
      if (!user_id) return reject('No user id provided')
      this.vk.call('photos.get', {
        owner_id: user_id,
        album_id: typeToSearch,
        rev: 1
      }).then(res => {
        const { count , items } = res
        if (count === 0) {
          return reject()
        }

        items.forEach((item, index, array) => {
          array[index] = item.id
        })
        return resolve(res)
      })
      .catch(e => {
        return reject(e)
      })
    })
  }
}

module.exports = VK