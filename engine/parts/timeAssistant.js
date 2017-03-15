class TimeAssistant {
  constructor () {

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

  getDateForFirebase () {
    let time = this.getCurrentTime()
    const { year, month, date } = time
    return `${year}/${this.formatValue(month)}/${this.formatValue(date)}`
  }

  getDateForLogs () {
    let time = this.getCurrentTime()
    const { year, month, date } = time
    return `${year}-${this.formatValue(month)}-${this.formatValue(date)}`
  }
}

const time = new TimeAssistant()

module.exports = TimeAssistant