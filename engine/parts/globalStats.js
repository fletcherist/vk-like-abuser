const Users = require('./users')
const DB = require('./db')

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
    return new Promise((resolve, reject) => {
      return resolve()
    })
  }

  countActiveUsers () {
    return new Promise((resolve, reject) => {
      return resolve()
    })
  }

  countAllCounters () {
    return Promise.all([
      this.countAllLikes,
      this.countAllUsers,
      this.countActiveUsers
    ])
  }

}

module.exports = GlobalStats