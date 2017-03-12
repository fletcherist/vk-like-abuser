const notifier = require('node-notifier')

const DB = require('./parts/db')
const VK = require('./parts/vk')

const Users = require('./parts/users')
const Console = require('./parts/console')
const Listeners = require('./parts/listeners')
const GlobalStats = require('./parts/globalStats')
const globalStats = new GlobalStats()
const Engine = require('./parts/engine')
const ErrorResolver = require('./parts/errorResolver')

globalStats.countAllCounters()
  .then(r => {})

const algorithms = require('./algorithms')

const listeners = new Listeners()
// const engine = new Engine()

const SITUATIONS = require('./config').SITUATIONS

notifier.notify({
  'title': 'VK Like Abuser',
  'message': 'Application has benn successfully started!'
})

// new Engine({
//   situation: SITUATIONS.FAST_TO_TARGET,
//   target: 337539863
// })



// const autofixers = new Autofixers()
