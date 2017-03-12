const notifier = require('node-notifier')

const DB = require('./db')
const Console = require('./console')
const Engine = require('./engine')
const SITUATIONS = require('../config').SITUATIONS

const Auth = require('./auth')

const VK = require('./vk')

class Listeners {
  constructor () {

    this.db = new DB()
    this.console = new Console()

    this.listenForNewUsers()
    this.listenForTokenFabrique()
    // this.db.updateUsersInfo()
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

      notifier.notify({
        'title': 'New User',
        'message': `${user.id} has just signed in. Start engine for him`
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
        const other = data.val()

        const { user_id } = other

        if (!access_token || !user_id) {
          this.db.setNotValid()
        }

        const vkUser = new VK(access_token)

        vkUser.checkToken()
          // Success authentication
          // — Register new user
          .then(r => {
            vkUser.getUser().then(user => {
              // TODO:
              // this.db.addUser({
              //   access_token: access_token
              // })
              // Get some info about this user
              new Auth().signupSuccess({
                user: user,
                access_token: access_token
              })

            }).catch(e => {

            })
          })
          .catch(e => {
            new Auth().signupFailure({
              error: e.toString()
            })
          })
    })
  }
}


module.exports = Listeners