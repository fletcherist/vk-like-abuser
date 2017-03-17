const notifier = require('node-notifier')

const DB = require('./db')
const Console = require('./console')
const Engine = require('./engine')
const GlobalStats = require('./globalStats')


const SITUATIONS = require('../config').SITUATIONS

const Auth = require('./auth')

const VK = require('./vk')

class Listeners {
  constructor () {

    this.db = new DB()
    this.console = new Console()

    this.listenForNewUsers()
    this.listenForTokenFabrique()
    this.db.updateUsersInfo()
  }

  listenForNewUsers () {
    this.console.notify('{Listeners} Listening for new users..')
    let users = this.db.db.ref('users')

    users.orderByChild('createdAt').startAt(Date.now()).on('child_added', data => {
      let user = data.val()
      new DB().updateUserInfo(user)

      new Engine({
        situation: SITUATIONS.FAST_TO_TARGET,
        target: user.id
      })

      new GlobalStats().incrementUsersCount()

      notifier.notify({
        'title': 'New User',
        'message': `${user.username} has just signed in. Start engine for him`
      })
    })
  }

  listenForTokenFabrique () {
    this.console.notify('{Listeners} Listening for token fabrique')
    let tokenFabrique = this.db.db.ref('/token_fabrique')
    tokenFabrique
      .orderByChild('createdAt')
      .startAt(Date.now()).on('child_added', data => {
        const access_token = data.key
        const user = data.val()

        const { user_id } = user

        if (!access_token || !user_id) {
          this.db.setNotValid()
        } else {
          new Auth({access_token, user}).authenticate()
        }
    })
  }
}


module.exports = Listeners