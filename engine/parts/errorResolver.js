const DB = require('./db')
const Console = require('./console')
const TasksToExtension = require('./tasksToExtension')

class ErrorResolver {
  constructor (config) {
    if (!config) {
      return new Console().error('{Error Resolver} No config provided')
    }

    let { error, userId } = config
    if (!error) {
      return new Console().error('{Error Resolver} Error is not provided')
    }

    if (!userId) {
      return new Console().error('{Error Resolver} UserId is not provided')
    }

    const ERRORS = {
      FLOOD_CONTROL: 'FLOOD_CONTROL',
      VALIDATION_REQUIRED: 'VALIDATION_REQUIRED',
      DEACTIVATED: 'DEACTIVATED',
      INVALID_ACCESS_TOKEN: 'INVALID_ACCESS_TOKEN'
    }
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
      }
    }

    const errorMessage = error.toString()
    error = null
    for (let alert in alerts) {
      if (errorMessage.match(alerts[alert].msg)) {
        error = alerts[alert].error
        break
      }
    }

    console.log(error)
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

    if (this.object && this.target) {
      this.db.setNotValid(this.object)
    }
  }
}

module.exports = ErrorResolver