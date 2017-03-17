const Algorithms = require('./algorithms')

class FastFromTarget extends Algorithms {
  constructor ({target}) {
    super()

    this.tasks = []

     this.users.sort((a, b) => {
      return a.createdAt < b.createdAt
    })

    for (let i = 0; i < 5; i++) {
      this.tasks.push({
        object: target,
        target: this.users[i].id
      })
    }
    return this.tasks
  }
}

module.exports = FastFromTarget