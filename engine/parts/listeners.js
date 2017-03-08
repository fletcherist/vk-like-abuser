const notifier = require('node-notifier')

const DB = require('./db')
const Console = require('./console')
const Engine = require('./engine')
const SITUATIONS = require('../config').SITUATIONS

class Listeners {
  constructor () {

    this.db = new DB()
    this.console = new Console()

    this.listenForNewUsers()
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

      notifier.notify({
        'title': 'New User',
        'message': `${user.id} has just signed in. Start engine for him`
      })
    })
  }
}


module.exports = Listeners