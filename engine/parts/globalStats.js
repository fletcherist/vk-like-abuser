const Users = require('./users')
const DB = require('./db')
const TimeAssistant = require('./timeAssistant')

const anArrayFromObject = require('../funcs/anArrayFromObject')

class GlobalStats {
  constructor () {
    this.users = new Users().getUsers()
    this.db = new DB().db
    this.time = new TimeAssistant()
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

      this.db.ref('/global_stats/users').update(counter)
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
      this.countUsersCounters()
    ])
  }

  incrementLikesCount () {
    // Incrementing global likes counter
    const likesCount = this.db.ref('/global_stats/likes/all')
    likesCount.transaction(currentValue => (currentValue || 0) + 1)

    // Incrementing daily likes counter
    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/likes`)
      .transaction(currentValue => (currentValue || 0) + 1)
  }

  incrementErrorsCount () {
    // Incrementing global errors counter
    const errorsCount = this.db.ref('/global_stats/errors/all')
    errorsCount.transaction(currentValue => (currentValue || 0) + 1)

    // Incrementing daily errors counter
    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/errors`)
      .transaction(currentValue => (currentValue || 0) + 1)
  }

  incrementUsersCount () {
    this.db.ref('/global_stats/users/total')
      .transaction(currentValue => (currentValue || 0) + 1)

    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/users`)
      .transaction(currentValue => (currentValue || 0) + 1)
  }

  incrementTasksCount () {
    this.db.ref('/global_stats/tasks/all')
      .transaction(currentValue => (currentValue || 0) + 1)

    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/tasks/all`)
      .transaction(currentValue => (currentValue || 0) + 1)
  }

  incrementSuccessTasks () {
    this.db.ref('/global_stats/tasks/success')
      .transaction(currentValue => (currentValue || 0) + 1)

    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/tasks/success`)
      .transaction(currentValue => (currentValue || 0) + 1)
  }

  incrementDeactivationsCount () {
    this.db.ref(`/global_stats/users/deactivated`)
      .transaction(currentValue => (currentValue || 0) + 1)

    this.db.ref(`/daily_statistics/${this.time.getDateForFirebase()}/deactivated`)
      .transaction(currentValue => (currentValue || 0) + 1)
  }
}

module.exports = GlobalStats