const notifier = require('node-notifier')

const Console = require('./console')

class Auth {
  constructor () {
    const DB = require('./db')

    this.DB = new DB()
    this.db = this.DB.db
  }

  signupSuccess ({user, access_token}) {
    console.log(user)

    try {
      this.db.ref(`/users/${user.id}`).set({
        access_token: access_token,
        success_auth: 0,
        need_validation: 1
      })
    } catch (e) {
      console.log(e)
    }

    notifier.notify({
      title: 'New token has been passed',
      message: 'success'
    })
    console.log('atuh succeess')
  }

  signupFailure ({error, access_token}) {
    console.log(error)
    notifier.notify({
      title: 'New token has been passed',
      message: 'error'
    })
  }
}

module.exports = Auth