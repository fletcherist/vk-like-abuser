const Algorithms = require('./algorithms')
const shuffleArray = require('../funcs/shuffleArray')

// famous algorithm fp implementation
const fpQueueTaskAlgorithm = users => users
  .filter(user => Boolean(user.id))
  .map((user, index, array) => {
    const target = index === array.length - 1
      ? array[0].id // connects latest with the first
      : array[index + 1].id // connects previous with current
    return {
      object: user.id,
      target: target
    }
  })

class Queue extends Algorithms {
  constructor() {
    super()
    this.users = shuffleArray(this.users)

    for (let i = 0; i <= this.users.length - 1; i++) {
      if (i === this.users.length - 1) {
        this.tasks.push({
          object: this.users[i].id,
          target: this.users[0].id
        })
        break
      }

      this.tasks.push({
        object: this.users[i].id,
        target: this.users[i + 1].id
      })
    }

    return this.tasks
  }
}

module.exports = Queue
module.exports.fpQueueTaskAlgorithm = fpQueueTaskAlgorithm
