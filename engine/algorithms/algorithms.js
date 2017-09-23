const Users = require('../parts/users')
const shuffleArray = require('../funcs/shuffleArray')

class Algorithms {
  constructor() {
    this.tasks = []
    this.users = new Users().getUsers()
  }
}

module.exports = Algorithms
