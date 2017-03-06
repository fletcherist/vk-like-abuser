const Users = require('./users')
const DB = require('./db')

const anArrayFromObject = require('../funcs/anArrayFromObject')

class GlobalStats {
  constructor () {
    this.users = new Users().getUsers()
    this.db = new DB().db
  }

  countAllLikes () {
    return new Promise((resolve, reject) => {

      return resolve()
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

  countInvalidUsers () {
    this.users
  }

  countUsersCounters () {
    return new Promise((resolve, reject) => {
      const users = this.db.ref('/users')
      users.once('value', snap => {
        if (snap.val()) {
          this.users = snap.val()

          return Promise.all([
            this.countAllUsers(),
            this.countActiveUsers(),
            this.countInvalidUsers()
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
    const likesCount = this.db.ref('/global_stats/likes/all')
    likesCount.transaction(currentValue => (currentValue || 0) + 1)
  }

}

module.exports = GlobalStats