const Queue = require('./queue')
const { fpQueueTaskAlgorithm } = require('./queue')
const Groups = require('./groups')
const FastToTarget = require('./fastToTarget')
const FastFromTarget = require('./fastFromTarget')

const algorithms = {
  Queue,
  Groups,
  FastToTarget,
  FastFromTarget,

  fpQueueTaskAlgorithm
}

module.exports = algorithms
module.exports.fpQueueTaskAlgorithm = fpQueueTaskAlgorithm
