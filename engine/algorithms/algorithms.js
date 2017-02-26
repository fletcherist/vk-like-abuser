const Users = require('../parts/users')

class Algorithms {
  constructor () {
    this.tasks = []
    this.users = new Users().getUsers()
  }
}

module.exports = Algorithms