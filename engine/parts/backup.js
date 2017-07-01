const fs = require('fs')

const Console = require('./console')
const TimeAssistant = require('./timeAssistant')

const getFolders = require('../funcs/getFolders')

class Backup {
  constructor () {
    const DB = require('./db')

    this.DB = new DB()
    this.time = new TimeAssistant()
    this.db = this.DB.db
  }

  initialize () {
    new Console().notify('{Backup}: New backup has been initialized')
    this.backupUsers()
    this.backupTasks()
    this.backupStatistics()
    this.backupDailyStatistics()
  }

  getLatestBackup () {
    new Console().notify('{Backup}: Getting latest backup')
    try {
      const folders = getFolders(this.getBackupDir())
      if (!folders || folders.length === 0) {
        return false
      }

      console.log(folders)

      const latestBackupFolder = folders.reduce((_prev, _current) => {
        const previous = _prev.split('-').map(n => parseInt(n))
        const current = _current.split('-').map(n => parseInt(n))

        for (const i in current) {
          if (current[i] > previous[i]) {
            return _current
          }
        }
        return _prev
      })

      console.log(latestBackupFolder)

    } catch (e) {
      console.log(e)
    }

    // console.log(this.time.getDateForLogs())
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
    

    const formattedData = JSON.stringify(data, null, 2)
    try {
      const path = `${this.getBackupDir()}/${this.time.getDateForLogs()}`
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

  getBackupDir () {
    const dirArr = __dirname.split('/')
    dirArr.splice(dirArr.length - 1, 1)
    const dir = dirArr.join('/')

    return `${dir}/backup`
  }
}

module.exports = Backup