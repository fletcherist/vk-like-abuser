const { segmentClient } = require('./app')

const Users = require('./users')
const DB = require('./db')
const TimeAssistant = require('./timeAssistant')

const anArrayFromObject = require('../funcs/anArrayFromObject')

class GlobalStats {
  constructor () {
    this.users = new Users()
    this.db = new DB().db
    this.time = new TimeAssistant()
    this.initialized = false
  }

  initialize () {
    return new Promise ((resolve, reject) => {
      const usersInstance = new Users()
      usersInstance.initialize().then(() => {
        this.users = usersInstance.getUsers()
        this.db = new DB().db
        this.time = new TimeAssistant()
        this.initialized = true

        return resolve()
      }).catch(e => reject(e))
    })
  }

  countAllLikes () {
    return new Promise((resolve, reject) => {
      this.db.ref('/likes').once('value', snap => {
        let likes = snap.val()
        console.warn(likes)
        return resolve() 
      })
    })
  }

  countAllUsers () {
    let usersCount = Object.keys(this.users).length
    this.db.ref('/global_stats/users/total')
      .transaction(currentValue => usersCount)
    return Promise.resolve()
  }

  countActiveUsers () {
    let users = anArrayFromObject(this.users)
    let counter = {
      active: 0,
      inactive: 0,
      valid: 0,
      invalid: 0
    }
    users.forEach(user => {
      if (user.isActive === true) {
        counter.active++
      } else if (user.isActive === false) {
        counter.inactive++
      }

      if (user.isValid === true) {
        counter.valid++
      } else if (user.isValid === false) {
        counter.invalid++
      }
    })
    this.db.ref('/global_stats/users').update(counter)
    this.track('counters.countActiveUsers')
  }


  countGenders () {
    return new Promise ((resolve, reject) => {
      const users = anArrayFromObject(this.users)
      let male = 0
      let female = 0
      let notDefinedGender = 0
      users.forEach(user => {
        const { sex } = user
        if (sex === 'm') male++
        else if (sex === 'f') female++
        else notDefinedGender++
      })

      this.db.ref('/global_stats/sex').update({male, female})
      this.track('counters.countGenders')

      return resolve()
    })
  }


  countUsersCounters () {
    return new Promise((resolve, reject) => {
      const users = this.db.ref('/users')
      users.once('value', snap => {
        if (snap.val()) {
          this.users = snap.val()

          return Promise.all([
            this.countAllUsers(),
            this.countActiveUsers()
          ]).then(() => {
            return resolve()
          })
        }
        return reject()
      })
    })
  }

  countAllCounters () {
    return Promise.all([
      this.countUsersCounters(), this.countGenders()
    ])
  }

  incrementLikesCount () {
    // Incrementing global likes counter
    const likesCount = this.db.ref('/global_stats/likes/all')
    likesCount.transaction(currentValue => (currentValue || 0) + 1)

    // Incrementing daily likes counter
    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/likes`)
      .transaction(currentValue => (currentValue || 0) + 1)

    this.track('likes.success')
  }

  incrementErrorsCount () {
    // Incrementing global errors counter
    const errorsCount = this.db.ref('/global_stats/errors/all')
    errorsCount.transaction(currentValue => (currentValue || 0) + 1)

    // Incrementing daily errors counter
    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/errors`)
      .transaction(currentValue => (currentValue || 0) + 1)

    this.track('likes.error')
  }

  incrementUsersCount () {
    this.db.ref('/global_stats/users/total')
      .transaction(currentValue => (currentValue || 0) + 1)

    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/users`)
      .transaction(currentValue => (currentValue || 0) + 1)

    this.track('users.newUser')
  }

  incrementTasksCount () {
    this.db.ref('/global_stats/tasks/all')
      .transaction(currentValue => (currentValue || 0) + 1)

    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/tasks/all`)
      .transaction(currentValue => (currentValue || 0) + 1)

    this.track('tasks.newTask')
  }

  incrementSuccessTasks () {
    this.db.ref('/global_stats/tasks/success')
      .transaction(currentValue => (currentValue || 0) + 1)

    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/tasks/success`)
      .transaction(currentValue => (currentValue || 0) + 1)

    this.track('tasks.successTask')
  }

  incrementDeactivationsCount () {
    this.db.ref(`/global_stats/users/deactivated`)
      .transaction(currentValue => (currentValue || 0) + 1)

    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/deactivated`)
      .transaction(currentValue => (currentValue || 0) + 1)

    this.track('users.deactivate')
  }

  incrementEnginesCount () {
    this.db.ref('/global_stats/engines')
      .transaction(currentValue => (currentValue || 0) + 1)

    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/engines`)
      .transaction(currentValue => (currentValue || 0) + 1)

    this.track('engine.new')
  }

  track (eventName) {
    segmentClient.track({
      event: eventName,
      userId: 'userId'
    })
  }
}

class AgeStats extends GlobalStats {
  constructor () {
    super()

    this.path = '/global_stats/age'
  }

  async setMedianFemaleAge (age) {
    return await this.db.ref(`${this.path}/median_female`).transaction(curr => age)
  }

  async setMedianMaleAge (age) {
    return await this.db.ref(`${this.path}/median_male`).transaction(curr => age)
  }

  async setMedianCommonAge (age) {
    return await this.db.ref(`${this.path}/median_common`).transaction(curr => age)
  }
}

module.exports = GlobalStats
module.exports.AgeStats = AgeStats