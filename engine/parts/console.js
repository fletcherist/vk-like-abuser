const TimeAssistant = require('./timeAssistant')

const fs = require('fs')

let consoleInstance = null

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

module.exports.log = () => ({
  notify: msg => new Console().notify(msg),
  error: msg => new Console().error(msg),
  success: msg => new Console().success(msg)
})


module.exports = Console
