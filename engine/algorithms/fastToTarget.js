const Algorithms = require('./algorithms')

class FastToTarget extends Algorithms {
  constructor ({target, amount}) {
    super()

    this.amount = amount || 20
    console.log(this.users, target)

    this.tasks = []

    for (let i = 0; i < this.amount; i++) {
      this.tasks.push({
        object: this.users[i].id,
        target: target
      })
    }
    return this.tasks
  }
}

module.exports = FastToTarget