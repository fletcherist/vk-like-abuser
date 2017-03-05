const DB = require('./db')
const Console = require('./console')
const Users = require('./users')
const Like = require('./like')
const GlobalStats = require('./globalStats')

const algorithms = require('../algorithms')
const SITUATIONS = require('../config').SITUATIONS
const RESTART_ENGINE_TIME = 60000

class Engine {
  constructor (config) {
    this.situation = null
    this.target = null

    if (config) {
      const { situation, target } = config
      if (situation.length > 0) {
        console.warn('asdasdas')
        this.situation = config.situation
        this.target = config.target
      }
    } else {
      this.situation = SITUATIONS.DEFAULT
    }

    this.db = new DB()
    this.users = new Users()
    this.globalStats = new GlobalStats()
    this.tasks = []

    if (!this.isItTimeToRunEngine()) {
      return false
    }

    this.users.initialize()
      .then(() => {
        new Console().success('{Engine} is initialized')
        this.getTasks()
        this.start()
      })
  }

  start () {
    this.getNextTask()
  }

  getTasks () {
    new Console().notify(`{Engine} Current Situation >>> «${this.situation}»`)
    switch (this.situation) {
      case SITUATIONS.DEFAULT:
        new Console().notify(`{Engine} Choosing Queue Algorithm`)
        this.tasks = new algorithms.Queue()
        break
      case SITUATIONS.FAST_TO_TARGET:
        if (this.target) {
          new Console().notify(`{Engine} Choosing Fast To Target Algorithm`)
          this.tasks = new algorithms.FastToTarget({
            target: this.target
          })
        }
        break
      default:
        new Console().notify(`{Engine} Choosing Queue Algorithm`)
        this.tasks = new algorithms.Queue()
        break
    }

    console.log(this.tasks)
  }

  getNextTask () {
    if (this.tasks.length === 0) {
      new Console().success('{Engine} All tasks are done')

      if (this.situation === SITUATIONS.FAST_TO_TARGET) {
        return false
      }

      new Console().notify('{Engine} New engine cycle will be started in 30s')
      setTimeout(() => {
        new Console().notify('{Engine} New engine has been just started')
        return new Engine()
      }, RESTART_ENGINE_TIME)
      return
    }
    this.doTask(this.tasks[0]).then(() => {
      this.tasks.shift()
      this.getNextTask()
    })
  }

  doTask ({object, target}) {
    return new Promise((resolve, reject) => {
      new Like({object, target})
        .then(() => {
          this.globalStats.incrementLikesCount()
          return resolve()
        })
        .catch((e) => {
          console.warn(e)
          return resolve()
        })
    })
  }

  isItTimeToRunEngine () {
    const currentTime = new Date().getHours()
    if (currentTime >= 2 && currentTime < 8) {
      new Console().notify('{Engine} Its not a time to run Engine yet!')
      new Console().notify('{Engine} Will try to run engine in 1 hour!')
      setTimeout(() => {

        return new Engine()
      }, 1000 * 60 * 60)

      return false
    }
    return true
  }
}

module.exports = Engine