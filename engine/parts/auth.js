const notifier = require('node-notifier')

const DB = require('./db')
const Console = require('./console')

class Auth {
  constructor () {
    this.db = new DB()
  }

  signupSuccess () {
    notifier.notify({
      title: 'New token has been passed',
      message: 'success'
    })
  }

  signupFailure () {

  }
}

module.exports = Auth