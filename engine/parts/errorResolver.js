const Console = require('./console')
const TasksToExtension = require('./tasksToExtension')

const ERRORS = {
  FLOOD_CONTROL: 'FLOOD_CONTROL',
  VALIDATION_REQUIRED: 'VALIDATION_REQUIRED',
  DEACTIVATED: 'DEACTIVATED',
  INVALID_ACCESS_TOKEN: 'INVALID_ACCESS_TOKEN',
  INVALID_SESSION: 'INVALID_SESSION'
}

class ErrorResolver {
  constructor (config) {
    if (!config) return new Console().error('{Error Resolver} No config provided')

    let { error, object, target, item } = config

    if (!error) return new Console().error('{Error Resolver} Error is not provided')
    if (!object) return new Console().error('{Error Resolver} object is not provided')

    this.error = error.toString()
    this.object = object
    this.target = target
    this.item = item

    const DB = require('./db')
    const GlobalStats = require('./globalStats')

    this.db = new DB()
    this.globalStats = new GlobalStats()

    console.warn(error)

    error = this.findError()
    

    console.warn(error)
    switch (error) {
      case ERRORS.FLOOD_CONTROL:
        this.db.setFloodControl(this.object)
        break
      case ERRORS.VALIDATION_REQUIRED:
        const task = new TasksToExtension().add({
          object: this.object,
          target: this.target,
          item: this.item
        })

        this.db.setInactive(this.object)
        break
      default:
        break
    }

    // Incrementing the all errors counter
    this.globalStats.incrementErrorsCount()

    // if (this.object && this.target) {
    //   this.db.setNotValid(this.object)
    // }
  }

  findError () {
    const alerts = {
      floodControl: {
        msg: 'Flood control',
        error: ERRORS.FLOOD_CONTROL
      },
      validationRequired: {
        msg: 'Validation required: please open redirect_uri in browser',
        error: ERRORS.VALIDATION_REQUIRED
      },
      invalidAccessToken: {
        msg: 'invalid access_token',
        error: ERRORS.INVALID_ACCESS_TOKEN
      },
      invalidSession: {
        msg: 'invalid session',
        error: ERRORS.INVALID_SESSION
      }
    }

    let error = null
    for (let alert in alerts) {
      if (this.error.match(alerts[alert].msg)) {
        error = alerts[alert].error
        break
      }
    }

    return error
  }
}

module.exports = ErrorResolver