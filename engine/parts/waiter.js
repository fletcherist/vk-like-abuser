const TimeAssistant = require('./TimeAssistant')

const timeAssistant = new TimeAssistant()

const speedModifier = x => 1 / Math.sqrt(x / 2)

const waiter = (...params) => {
	const time = timeAssistant.getCurrentTime()
	const { hours } = time

	for (let i = 0; i < 24; i++) {
		console.log(speedModifier(i))
	}
	// console.log(speedModifier(hours))

	console.log(time)
	return 1000
}

waiter()

module.exports = waiter

