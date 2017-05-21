const VKApi = require('node-vkapi')
const Console = require('./console')
const ErrorResolver = require('./errorResolver')

class VK {
  constructor (access_token) {
    if (!access_token) return new Console().error('{VK} No access token provided')
    this.vk = new VKApi({
      token: access_token,
      delays: true
    })

    this.access_token = access_token

    this.vk.call('stats.trackVisitor')
      .then(res => {})
      .catch(e => false)
  }

  checkToken () {
    return new Promise((resolve, reject) => {

      const client_secret = require('../config').vk.client_secret
      const app_id = require('../config').vk.app_id

      const appVK = new VKApi({
        app: {
          id: app_id,
          secret: client_secret
        }
      })

      appVK.auth.server().then(r => {
        const serverAccessToken = r.access_token

        appVK.call('secure.checkToken', {
          token: this.access_token,
          access_token: serverAccessToken,
          client_secret: client_secret
        }).then(res => {
          return resolve(res)
          console.log(res)
        }).catch(e => {
          console.log(e)
          return reject(e)
        })
      })
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
        return resolve(res)
      }).catch(e => {
        return reject(e)
      })
    })
  }

  getWall (user_id) {

  }

  getPhoto (user_id) {
    const types = ['wall', 'profile']
    const typeToSearch = types[Math.floor(Math.random() * types.length)]

    return new Promise ((resolve, reject) => {
      this.vk.call('photos.get', {
        owner_id: user_id,
        album_id: typeToSearch,
        extended: 1,
        rev: 1
      }).then(res => {
        const { count, items } = res
        if (count === 0) {
          return reject()
        }

        for (let i = 0; i < items.length; i++) {
          const { id, likes } = items[i]
          if (!id || !likes) {
            return reject()
          } 
          if (id && likes) {
            if (likes.user_likes === 0) {
              return resolve(id)
            }
          }
        }

        return reject()
      }).catch(e => {
        return reject(e)
      })
    })
  }
}

module.exports = VK