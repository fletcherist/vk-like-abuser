const Algorithms = require('./algorithms')

class FastToTarget extends Algorithms {
  constructor ({target}) {
    super()
    console.log(this.users, target)

    this.tasks = []

    for (let i = 0; i < 20; i++) {
      this.tasks.push({
        object: this.users[i].id,
        target: target
      })
    }
    return this.tasks
  }
}

module.exports = FastToTarget