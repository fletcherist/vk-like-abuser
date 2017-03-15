const DB = require('../app').DB
const TimeAssistant = require('./timeAssistant')

const fs = require('fs')

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

      this.time = new TimeAssistant

      consoleInstance = this
    }
    return consoleInstance
  }

  error (msg) {
    if (!this.config.errors)
      return false
    let message = `[${this.time.getFormattedTime()}] ` + 'Error: ' + msg
    console.warn(message)
    new Pushes().send(message)
    this.writeToLogs(message)
  }

  success (msg) {
    if (!this.config.success)
      return false
    let message = `[${this.time.getFormattedTime()}] ` + 'Success: ' + msg
    console.log(message)
    new Pushes().send(message)
    this.writeToLogs(message)
  }

  notify (msg) {
    if (!this.config.notifications)
      return false
    let message = `[${this.time.getFormattedTime()}] ` + 'Notification: ' + msg
    console.log(message)
    new Pushes().send(message)
    this.writeToLogs(message)
  }

  writeToLogs (msg) {
    const dirArr = __dirname.split('/')
    dirArr.splice(dirArr.length - 1, 1)
    const dir = dirArr.join('/')

    fs.appendFile(`${dir}/logs/${this.time.getDateForLogs()}.txt`,
      `${msg}\n`, () => {})
  }
}


module.exports = Console