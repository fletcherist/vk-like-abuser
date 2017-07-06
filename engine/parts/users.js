const DB = require('./db')
const Console = require('./console')

let usersInstance = null

const { getUsers } = require('../api/db/users')

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

  async initialize () {
    if (this.initialized)
      return true

    try {
      await this.fetchUsers()
      this.initialized = true
      new Console().success('Class {Users} has been successfully initialized')
    } catch (e) {
      new Console().error('{Users} Can`t be initialized')
      return false
    }
  }

  async fetchUsers () {
    const users = await getUsers(10)
    for (let userId in users) {
      let user = users[userId]
      if (user.isActive === false || user.isValid === false) {
        delete users[userId]
      }
    }

    this.users = users
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

      if (this.users[user].id) {
        userList.push(this.users[user])
      }
    }
    this.usersCount = usersCount
    return userList
  }
}

module.exports = Users