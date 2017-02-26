const DB = require('../app').DB

let consoleInstance = null
let pushesInstance = null

class Pushes {
  constructor () {
    if (!pushesInstance) {
      // this.db = new DB()
      // this.pushes = this.db.ref('/pushes')
      
      pushesInstance = this
    }
    return pushesInstance
  }

  send (msg) {
    // this.pushes.push({
    //   time: new Date().toString(),
    //   message: msg
    // })
  }
}

class Console {
  constructor (msg) {
    if (!consoleInstance) {
      this.config = {
        errors: true,
        success: true,
        notifications: true
      }

      consoleInstance = this
    }
    return consoleInstance
  }

  error (msg) {
    if (!this.config.errors)
      return false
    let message = 'Error: ' + msg
    console.log(message)
    new Pushes().send(message)
  }

  success (msg) {
    if (!this.config.success)
      return false
    let message = 'Success: ' + msg
    console.log(message)
    new Pushes().send(message)
  }

  notify (msg) {
    if (!this.config.notifications)
      return false
    let message = 'Notification: ' + msg
    console.log(message)
    new Pushes().send(message)
  }
}


module.exports = Console