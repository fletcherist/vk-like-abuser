const Algorithms = require('./algorithms')

class FastFromTarget extends Algorithms {
  constructor ({target, amount}) {
    super()

    this.tasks = []
    this.amount = amount || 5

     this.users.sort((a, b) => {
      return a.createdAt < b.createdAt
    })

    for (let i = 0; i < this.amount; i++) {
      this.tasks.push({
        object: target,
        target: this.users[i].id
      })
    }
    return this.tasks
  }
}

module.exports = FastFromTarget