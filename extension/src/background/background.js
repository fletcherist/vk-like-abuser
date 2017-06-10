const EXTENSION_ID = chrome.runtime.id
const API = 'https://api.vk.com/method'
const VK_ABUSER_API_PRODUCTION = 'https://vkabuser.fletcherist.com'
const VK_ABUSER_API_DEVELOPMENT = 'http://localhost:80'
// const ENV = 'DEBUG'
const ENV = 'PRODUCTION'

/*
  This code is responsible for
  open the extension, clicking on the icon

  Thanks github.com/fourlex for the idea not to open the
  extension tab 10 thousand times
*/
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({
    'url': 'chrome-extension://' + EXTENSION_ID + '/*'
  }, function (tabs) {
      if (tabs.length === 0) {
        chrome.tabs.create({'url': chrome.extension.getURL('index.html'), 'selected': true})
      } else {
        chrome.tabs.update(tabs[0].id, {'active': true})
        chrome.windows.update(tabs[0].windowId, {focused:true})
      }
  })
})

/*
  This class is responsible for the background processing
  of the extension.

  First — tasks. Likes, that fail on our server — convert into
  tasks to the extension. That means, the extension should set these likes
  exactly from Chrome (not from our server)
*/

class TasksManager {
  constructor () {
    this.setTimeForGettingTasks = this.setTimeForGettingTasks.bind(this)
    this.isReadyForFetchingTasks = this.isReadyForFetchingTasks.bind(this)
    this.setDelayForNextTask = this.setDelayForNextTask.bind(this)
    this.isReadyForNewTask = this.isReadyForNewTask.bind(this)
  }
  setTimeForGettingTasks (time) {
    if (!time) time = Date.now()
    time = Number(time)

    chrome.storage.local.set({
      timeForGettingTasks: time
    })
  }

  isReadyForFetchingTasks (timeForGettingTasks) {
    if (!timeForGettingTasks) return false

    if (timeForGettingTasks <= Date.now()) {
      return true
    }
    return false
  }

  setDelayForNextTask (time) {
    if (!time) time = Date.now()
    time = Number(time)

    chrome.storage.local.set({
      timeForNextTask: time
    })
  }

  isReadyForNewTask (timeForNextTask) {
    if (!timeForNextTask) return false

    if (timeForNextTask <= Date.now()) {
      return true
    }
    return false
  }
}

class Background {
  constructor () {
      this.config = {
        socketServer: ENV === 'PRODUCTION'
          ? VK_ABUSER_API_PRODUCTION
          : VK_ABUSER_API_DEVELOPMENT
      }
      this.socket = io(this.config.socketServer)
      this.tasksManager = new TasksManager()

      this.user = {}

      this.initialize()
        .then(() => this.processing())
        .catch(e => console.log(e))

  }

  initialize () {
    return new Promise((resolve, reject) => {
      this.getDataFromStorage().then(data => {
        const { username, access_token, user_id } = data

        if (!data.access_token) {
          return reject('[initialize]: not authorized yet')
        }

        this.user.username = username
        this.user.access_token = access_token
        this.user.user_id = user_id

        console.log(this.user)
        return resolve()
      }).catch(e => reject('[initialization has been failed]'))
    })
  }

  /*
    This method is responsible for checking available tasks
    and do them. In loop.
  */
  processing () {
    /*
      TODO: Process tasks after getting
    */
    // this.getTasks().then(tasks => {
    //
    // }).catch(error => {
    //
    // })
    console.log(this.tasksManager)
    this.connectToAPI()

    this.setLike(96170043, 416404518)
      .then(result => console.log(result))
      .catch(e => console.error(e))

    this.removeLike(96170043, 416404518)
      .then(result => console.log(result))
      .catch(e => console.error(e))
  }

  /*
    This method is responsible for getting tasks
    from api infrastructure
  */

  connectToAPI () {
    this.socket.on('connect', () => {
      console.log('Connected to vkabuser.')
      this.socket.emit('count_online_users', users => {
        console.log(users)
      })
    })
  }

  getDataFromStorage () {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, storage => {
        if (storage) return resolve(storage)
        else return reject('[getDataFromStorage]: empty storage')
      })
    })
  }

  getTasks () {
    const self = this
    return new Promise((resolve, reject) => {
      this.getDataFromStorage().then(data => {

        const { access_token, username, user_id } = data
        if (!access_token || !username || !user_id) {
          return reject('Not authenticated')
        }

        self.socket.on('connect', () => {
          console.log('connected')
        })
        self.socket.emit('get_tasks', {
          user_id
        }, response => {
          console.log(response)
          const { error, message, tasks } = response
          if (error) {
            return reject(message)
          }

          console.log(tasks)
          return resolve(tasks)
        })
      })
    })
  }

  archieveTasks (tasks) {
    /*
      TODO: Save tasks to the Chrome Storage
    */
  }

  setLike (owner_id, item_id) {
    return new Promise((resolve, reject) => {
      console.log(this.user)

      if (!owner_id || !item_id) return reject('Not enough data')
      if (!this.user.access_token) return reject('Access token is not provided')

      return fetch(`${API}/likes.add?type=photo&owner_id=${owner_id}&&item_id=${item_id}&access_token=${this.user.access_token}`)
        .then(res => res.json())
        .then(res => {
          const { error } = res
          if (error) return reject(error)
          return resolve(res)
        })
        .catch(e => reject(e))
    })
  }

  removeLike (owner_id, item_id) {
    return new Promise((resolve, reject) => {
      if (!owner_id || !item_id) return reject('Not enough data')
      if (!this.user.access_token) return reject('Access token is not provided')

      return fetch(`${API}/likes.delete?type=photo&owner_id=${owner_id}&&item_id=${item_id}&access_token=${this.user.access_token}`)
        .then(res => res.json())
        .then(res => {
          const { error } = res
          if (error) return reject(error)
          return resolve(res)
        })
        .catch(e => reject(e))
    })
  }
}

// const Tasks = {
//   doTask: function (task) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         return resolve()
//       }, 1000)
//     })
//   },
//   markAsDone: function(task) {
//     const db = firebase.database()
//     const { item, object, target, key } = task
//     if (!item || !object || !target) return false
//     db.ref(`/tasks/${object}/${key}/status`)
//       .transaction(currentValue => 1)
//   },
//   getFromCache: function () {
//     return new Promise((resolve, reject) => {
//       chrome.storage.local.get(null, storage => {
//         if (!storage) return reject('Empty storage')
//         const { tasks } = storage
//         if (!tasks || tasks.length === 0) return reject('Invalid tasks type')
//         if (!Array.isArray(tasks)) return reject('Tasks should be an array')
//         return resolve(tasks)
//       })
//     })
//   },
//   save: function (tasks) {
//     if (!tasks) return false
//     chrome.storage.local.set({
//       tasks: tasks
//     })
//   }
// }

const background = new Background()
