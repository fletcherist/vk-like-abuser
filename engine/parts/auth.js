const notifier = require('node-notifier')

const DB = require('./db')
const Console = require('./console')

class Auth {
  constructor () {
    this.DB = new DB()
    this.db = this.DB.db
  }

  signupSuccess ({user, access_token}) {
    console.log(user)
    this.db.ref('/users/{user.user_id}').set({
      access_token: access_token,
      success_auth: 1
    })
    notifier.notify({
      title: 'New token has been passed',
      message: 'success'
    })
  }

  signupFailure ({error, access_token}) {

    notifier.notify({
      title: 'New token has been passed',
      message: 'error'
    })
  }
}

module.exports = Auth