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
	}

	getMedianAge () {
		const usersArray = _.values(this.users)

		let commonAge = 0
		let usersWithAge = 0

		usersArray.forEach(user => {
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
			commonAge += new Date().getFullYear() - (bdate[0] / 365 + bdate[1] / 12 + bdate[2])
		})

		const medianAge = (commonAge / usersWithAge).toFixed(1)
		return medianAge
	}
}

const analytics = new Analytics()

analytics.initialize().then(() => {

	const usersAnalytics = new UsersAnalytics()
	usersAnalytics.getMedianAge()

})

module.exports = Analytics