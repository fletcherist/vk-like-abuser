const fs = require('fs')

const Console = require('./console')
const TimeAssistant = require('./timeAssistant')

class Backup {
  constructor () {
    const DB = require('./db')

    this.DB = new DB()
    this.time = new TimeAssistant()
    this.db = this.DB.db

    this.backupUsers()
    this.backupTasks()
    this.backupStatistics()
    this.backupDailyStatistics()
  }

  backupUsers () {
    this.DB.getUsers().then(users => {
      this.saveData('users', users)
    }).catch(e => {
      console.warn(e)
    })
  }

  backupTasks () {
    this.db.ref('/tasks').once('value', snap => {
      const tasks = snap.val()
      this.saveData('tasks', tasks)
    })
  }

  backupStatistics () {
    this.db.ref('/statistics').once('value', snap => {
      const statistics = snap.val()
      this.saveData('statistics', statistics)
    })
  }

  backupDailyStatistics () {
    this.db.ref('/daily_statistics').once('value', snap => {
      const dailyStatistics = snap.val()
      this.saveData('daily_statistics', dailyStatistics)
    })
  }

  saveData (type, data) {
    console.log(type, data)
    const dirArr = __dirname.split('/')
    dirArr.splice(dirArr.length - 1, 1)
    const dir = dirArr.join('/')

    const formattedData = JSON.stringify(data, null, 2)
    try {
      const path = `${dir}/backup/${this.time.getDateForLogs()}`
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }

      fs.writeFile(`${path}/${type}.json`,
        `${formattedData}`, () => {})
      new Console().notify('{Backup} Backup was done')
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = Backup