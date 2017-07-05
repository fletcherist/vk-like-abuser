const Console = require('./console')
const TasksToExtension = require('./tasksToExtension')

const usersApi = require('./api/db/users')
const {deactivateUser} = usersApi

const ERRORS = {
  FLOOD_CONTROL: 'FLOOD_CONTROL',
  VALIDATION_REQUIRED: 'VALIDATION_REQUIRED',
  DEACTIVATED: 'DEACTIVATED',
  INVALID_ACCESS_TOKEN: 'INVALID_ACCESS_TOKEN',
  INVALID_SESSION: 'INVALID_SESSION',
  ACCESS_REVOKED: 'ACCESS_REVOKED',
  NO_ACCESS: 'NO_ACCESS'
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

    error = this.findError()


    // Creating the task to the extension
    if (this.object && this.target && this.item) {
      const task = new TasksToExtension().add({
        object: this.object,
        target: this.target,
        item: this.item
      })
    }
    

    console.warn(error)
    switch (error) {
      case ERRORS.FLOOD_CONTROL:
        this.db.setFloodControl(this.object)
        break
      case ERRORS.VALIDATION_REQUIRED:

        // this.db.setInactive(this.object)
        break
      case ERRORS.INVALID_SESSION:
        deactivateUser(this.target)
        this.globalStats.incrementDeactivationsCount()

        break

      case ERRORS.INVALID_ACCESS_TOKEN:
        deactivateUser(this.target)
        this.globalStats.incrementDeactivationsCount()
        break

      case ERRORS.ACCESS_REVOKED:
        // Here we must remove the user from our database
        deactivateUser(this.target)
        this.globalStats.incrementDeactivationsCount()

        break
      case ERRORS.DEACTIVATED:
        // Here we also must remove the user from our database
        deactivateUser(this.target)
        this.globalStats.incrementDeactivationsCount()
        break
      case ERRORS.NO_ACCESS:
        deactivateUser(this.target)
        this.globalStats.incrementDeactivationsCount()
        // Here we want user to give us an access again
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
      },
      accessRevoked: {
        msg: 'user revoke access for this token',
        error: ERRORS.ACCESS_REVOKED
      },
      userDeactivated: {
        msg: 'user deactivated',
        error: ERRORS.DEACTIVATED
      },
      noAccess: {
        msg: 'no access to call this method',
        error: ERRORS.NO_ACCESS
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