const notifier = require('node-notifier')
const firebase = require('firebase')
const VK = require('./vk')
const Like = require('./like')

const Console = require('./console')

const {
  incrementServerUsers,
  getServerByClientId
} = require('./servers')

class Auth {
  constructor ({user, access_token, server}) {
    const DB = require('./db')

    this.DB = new DB()
    this.db = this.DB.db

    this.user = user
    this.access_token = access_token
    this.server = server
  }

  async authenticate () {
    const vkUser = new VK(this.access_token)

    try {
      const user = await vkUser.getUser()
      // Get some info about this user
      await vkUser.like({target: 1, id: 376599151})
      return this.signupSuccess({
        user: user,
        access_token: this.access_token
      })
    } catch (e) {
      console.log(e)
      this.signupFailure({
        error: e.toString()
      })
    }
  }

  async signupSuccess ({user, access_token, server}) {
    console.log(user)
    const { first_name, last_name, photo_100, id } = user

    const username = `${first_name} ${last_name}`
    console.log('server', this.server)

    try {
      await this.db.ref(`/users/${id}`).update({
        access_token: this.access_token,
        success_auth: 1,
        need_validation: 0,
        photo_100: photo_100,
        username: username,
        id: id,
        isValid: true,
        isActive: true,
        server: this.server || 'dmitrow',
        createdAt: firebase.database.ServerValue.TIMESTAMP
      })

      if (this.server) {
        const serverName = getServerByClientId(this.server)
        await incrementServerUsers(serverName)
      }
    } catch (e) {
      console.error(e)
    }

    notifier.notify({
      title: 'New user [success]',
      message: `${username} has joined us`
    })
  }

  signupFailure ({error, access_token}) {
    console.warn(this.user)
    this.db.ref(`/users/${this.user.user_id}`).update({
      access_token: this.access_token,
      success_auth: 0,
      need_validation: 1,
      id: this.user.user_id,
      username: 'Unauthorized',
      createdAt: firebase.database.ServerValue.TIMESTAMP
    })
    console.log(error)
    notifier.notify({
      title: 'New user [failure]',
      message: 'error'
    })
  }
}

module.exports = Auth