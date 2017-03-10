const TimeAssistant = require('./timeAssistant')

class SpeedController {
  constructor () {
    this.minimumDelay = 1000
    this.maximumDelay = 5000
    this.time = new TimeAssistant().getCurrentTime()
  }

  getDelay () {
    // Getting delay according the time
    // Of the day
    this.time = new TimeAssistant().getCurrentTime()
    for (let i = 1; i <= 24; i++) {
      console.log(Math.sqrt(i) / 10)
    }

    console.log(this.time)
  }
}

new SpeedController().getDelay()


module.exports = SpeedController