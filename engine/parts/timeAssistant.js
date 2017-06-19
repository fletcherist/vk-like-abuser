class TimeAssistant {
  constructor () {
    this.getCurrentTime = this.getCurrentTime.bind(this)
    this.getFormattedTime = this.getFormattedTime.bind(this)
    this.getDateForFirebase = this.getDateForFirebase.bind(this)
    this.getDateForLogs = this.getDateForLogs.bind(this)
  }

  getCurrentTime () {
    const time = new Date()
    return {
      year: time.getFullYear(),
      day: time.getDay(),
      month: time.getMonth() + 1,
      date: time.getDate(),
      minutes: time.getMinutes(),
      seconds: time.getSeconds(),
      hours: time.getHours(),
      milliseconds: time.getMilliseconds()
    }
  }

  formatValue (value) {
    if (value < 10) {
      value = '0' + value
    }
    return value
  }

  getFormattedTime () {
    const currentTime = this.getCurrentTime()
    let hours = currentTime.hours
    if (hours < 10) {
      hours = '0' + hours
    }

    let minutes = currentTime.minutes
    if (minutes < 10) {
      minutes = '0' + minutes
    }

    return `${hours}:${minutes}`
  }

  // ex 2017/06/13
  getDateForFirebase () {
    let time = this.getCurrentTime()
    const { year, month, date } = time
    return `${year}/${this.formatValue(month)}/${this.formatValue(date)}`
  }

  // ex 2017-06-13
  getDateForLogs () {
    let time = this.getCurrentTime()
    const { year, month, date } = time
    return `${year}-${this.formatValue(month)}-${this.formatValue(date)}`
  }
}

const time = new TimeAssistant()

module.exports = TimeAssistant