const Backup = require('./backup')

const _ = require('lodash')


let _dataInstance = {}
class Analytics {
	constructor () {

		this.isInitialized = false
		this.data = _dataInstance

	}

	initialize () {
		return new Promise(resolve => {
			new Backup().getLatestBackup().then(data => {

				_dataInstance = _.merge(_dataInstance, data)

				this.data = _dataInstance
				this.isInitialized = true
				return resolve(data)
			})
		})
	}
}


class UsersAnalytics extends Analytics {
	constructor () {
		super()
		this.users = this.data.users
		this.usersArray = _.values(this.users)
	}

	getMedianAge () {

		let commonAge = 0
		let usersWithAge = 0

		let menAge = 0
		let menWithAge = 0

		let womenAge = 0
		let womenWithAge = 0

		const calculateAge = bdate => new Date().getFullYear() - (bdate[0] / 365 + bdate[1] / 12 + bdate[2])

		this.usersArray.forEach(user => {
			if (!user.bdate) return
			const bdate = user.bdate.split('.').map(date => parseInt(date))
			if (bdate.length !== 3) return
			/*
			 * bdate[0] - day
			 * bdate[1] - month
			 * bdate[2] - year
			 */
			 usersWithAge++

			/* getting commonAge in years */
			commonAge += calculateAge(bdate)

			if (user.sex === 'm') {
				menWithAge++
				menAge += calculateAge(bdate)
			} else if (user.sex === 'f') {
				womenWithAge++
				womenAge += calculateAge(bdate)
			}
		})

		const medianAge = Number((commonAge / usersWithAge).toFixed(1))

		const menMedianAge = Number((menAge / menWithAge).toFixed(1))
		const womenMedianAge = Number((womenAge / womenWithAge).toFixed(1))

		return {
			common: medianAge,
			men: menMedianAge,
			women: womenMedianAge
		}
	}

	getInactiveUsers () {
		let usersArray = this.usersArray
		usersArray = usersArray.filter(user => user.latestLike)
		console.log(usersArray[0])

		usersArray = _.sortBy(usersArray, ['latestLike']).reverse()
		// usersArray = _.reverse(usersArray)
		// usersArray.sort((a, b) => (a.latestLike > b.latestLike))

		console.log(usersArray)

		for (let i = 0; i < 100; i++) {
			// console.log((Date.now() - usersArray[i].latestLike) / 1000 / 60 / 60)
			const latestLike = new Date(usersArray[i].latestLike)
			console.log(latestLike)
		}
	}
}

const analytics = new Analytics()

analytics.initialize().then(() => {

	const usersAnalytics = new UsersAnalytics()

	console.log(usersAnalytics.getMedianAge())
	// usersAnalytics.getInactiveUsers()

})

module.exports = Analytics