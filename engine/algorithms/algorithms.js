const Users = require('../parts/users')
const shuffleArray = require('../funcs/shuffleArray')

class Algorithms {
  constructor () {
    this.tasks = []
    this.users = new Users().getUsers()
  }

  sortUsersByLastLike () {
    console.log(this.users)
    this.users.sort((a, b) => {
      return a.latestLike > b.latestLike
    })
    console.log(this.users)
  }

  sortUsersByRandom () {
    console.log(this.users)
    this.users = shuffleArray(this.users)
    console.log(this.users)
  }
}

module.exports = Algorithms