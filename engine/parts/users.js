const DB = require('./db')
const Console = require('./console')

let usersInstance = null
class Users {
  constructor () {
    if (!usersInstance) {
      this.users = {}
      this.usersCount = 0
      this.initialized = false
      this.db = new DB()

      usersInstance = this
    }

    return usersInstance
  }

  initialize () {
    return new Promise ((resolve, reject) => {
      if (this.initialized) {
        return resolve()
      }

      this.fetchUsers()
        .then(res => {
          this.initialized = true
          new Console().success('Class {Users} has been successfully initialized')

          resolve()
        })
        .catch(e => {
          new Console().error('{Users} Can`t be initialized')
          reject()
        })
    })
  }

  fetchUsers () {
    return new Promise((resolve, reject) => {
      this.db.getUsers()
        .then(users => {
          this.users = users
          resolve()
        })
        .catch(e => reject())
    })
  }

  showUsers () {
    for (let user in this.users) {
      console.log(this.users[user].id)
    }
  }

  findById (id) {
    if (!id) return new Console().error('{Users} [id] is not provided.')

    if (typeof this.users[id] !== 'undefined') {
      return this.users[id]
    } else {
      new Console().notify(`{Users} User with id ${id} not found`)
      return false
    }
  }

  isUserExist (id) {
    if (this.findById(id) !== false) {
      return true
    }

    return false
  }

  getUsers () {
    var userList = []
    let usersCount = 0
    for (let user in this.users) {
      usersCount++
      if (!this.users[user].latestLike) {
        this.users[user].latestLike = 0
      }

      // If user with no VK id
      if (!this.users[user].id) {
        // Remove him from database
        this.removeUser(user)
      }

      if (this.users[user].id) {
        userList.push(this.users[user])
      }
    }
    this.usersCount = usersCount
    return userList
  }


  removeUser (id) {
    // TODO
  }
}

module.exports = Users