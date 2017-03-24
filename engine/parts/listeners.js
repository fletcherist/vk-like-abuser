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
    this.listenForDoneTasks()
  }

  listenForNewUsers () {
    this.console.notify('{Listeners} Listening for new users..')
    let users = this.db.db.ref('users')

    users.orderByChild('createdAt').startAt(Date.now()).on('child_added', data => {
      let user = data.val()
      new DB().updateUserInfo(user)

      console.log(user)

      new Engine({
        situation: SITUATIONS.FAST_TO_TARGET,
        target: user.id
      })

      new Engine({
        situation: SITUATIONS.FAST_FROM_TARGET,
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

        const { id } = user
        console.log(user)
        if (!access_token || !id) {
          this.db.setNotValid()
        } else {
          new Auth({access_token, user}).authenticate()
        }
    })
  }

  listenForDoneTasks () {
    this.console.notify('{Listeners} Listening for done tasks')

    const threeDays = 1000 * 60 * 60 * 24 * 3

    let doneTasks = this.db.db.ref('/tasks')
    doneTasks
      .on('child_changed', data => {
        const tasks = data.val()
        const user_id = data.key

        for (let taskId in tasks) {
          if (tasks[taskId].status === 1) {
            this.db.db.ref(`/tasks/${user_id}/${taskId}`).remove()
            new GlobalStats().incrementSuccessTasks()
          }
        }
      })
  }
}


module.exports = Listeners