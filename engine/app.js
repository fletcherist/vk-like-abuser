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

const TasksToExtension = require('./parts/tasksToExtension')
const algorithms = require('./algorithms')

const listeners = new Listeners()
// const engine = new Engine()

const BugFixer = require('./parts/bugFixer')
const Backup = require('./parts/backup')

// Creates a new backup every week
setInterval(() => {
  new Backup()
}, 1000 * 60 * 60 * 12 * 7)

setInterval(() => {
  new BugFixer().validateUsers()
  // new BugFixer().fixUsersID()
}, 1000 * 60 * 60 * 2)

setInterval(() => {
  globalStats.countAllCounters().then(r => {})
}, 1000 * 60 * 60 * 6)

// globalStats.countAllCounters().then(r => {})


globalStats.initialize()
	.then(() => {
		globalStats.countGenders()
	})



// new TasksToExtension().add({
//   object: 96170043,
//   target: 96170043,
//   item: 310653984
// })

const SITUATIONS = require('./config').SITUATIONS

notifier.notify({
  'title': 'VK Like Abuser',
  'message': 'Application has benn successfully started!'
})

// new Engine({
//   situation: SITUATIONS.FAST_TO_TARGET,
//   target: 288886736,
//   amount: 200
// })

// new Engine({
//   situation: SITUATIONS.FAST_FROM_TARGET,
//   target: 96170043
// })



// const autofixers = new Autofixers()
