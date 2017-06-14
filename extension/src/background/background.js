const EXTENSION_ID = chrome.runtime.id
const API = 'https://api.vk.com/method'
const VK_ABUSER_API_PRODUCTION = 'https://vkabuser.fletcherist.com'
const VK_ABUSER_API_DEVELOPMENT = 'http://localhost:80'
const DELAY_BETWEEN_TASKS = 1000 * 2
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

  }

  /*
    Get local tasks from Chrome Storage
  */
  getTasks () {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, storage => {
        const { tasks } = storage
        if (!tasks) return reject('No tasks available')
        return resolve(tasks)
      })
    })
  }

  /*
    Saves tasks to the Chrome Storage
  */
  cacheTasks (tasks) {
    if (!tasks) return false
    chrome.storage.local.set({tasks})
  }

  /*
    Removes task from Chrome Storage after it's done
  */
  removeTask (task) {
    return new Promise((resolve, reject) => {
      if (!task) return reject('Task is not defined')

      this.getTasks().then(tasks => {
        tasks.splice(tasks.findIndex(_task => _task.id = task.id), 1)
        this.cacheTasks(tasks)
        return resolve(`Task ${task.id} has been removed`)
      }).catch(e => reject(e))
    })
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

        this.connectToAPI()

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


    this.getTasks()
      .then(tasks => {
        this.tasksManager.cacheTasks(tasks)

        if (tasks.length > 0) {
          const { item, target, object, id } = tasks[0]
          if (item && object) {
            console.log(object, item)
            console.log('task has started')
            this.setLike(object, item)
              .then(result => {
                this.successTask(id)
              })
              .catch(e => {
                this.successTask(id)
              })
          }
          this.tasksManager.removeTask(tasks[0])
        }

        console.log(tasks)
    }).catch(e => console.error(e))

    setTimeout(this.processing.bind(this), DELAY_BETWEEN_TASKS)
  }

  errorTask (id) {
    console.log(`task ${id} was failed as well`)
    this.socket.emit('task_failed', {
      id: id,
      user_id: this.user.user_id
    }, status => {
      console.log(status)
    })
  }

  successTask (id) {
    console.log(`task ${id} done as well.`)
    this.socket.emit('task_done', {
      id: id,
      user_id: this.user.user_id
    }, status => {
      console.log(status)
    })
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

  /*
    This method fetches tasks from
    the VK Like Abuser Server
  */
  fetchTasks () {
    const self = this
    return new Promise((resolve, reject) => {
      const { user_id } = this.user

      this.getDataFromStorage().then(data => {
        const { latestFetch } = data
        // Time passed from the last fetch (in minutes)
        const timePassed = (Date.now() - latestFetch) / 1000 / 60
        /*
          Fetching data at least every 5 minutes
        */
        if (timePassed < 5) {
          return reject(`Not time yet. ${(5 - timePassed).toFixed(1)}m left.`)
        }
        self.socket.emit('get_tasks', {
          user_id
        }, response => {
          console.log('[fetchTasks]: tasks has fetched from the internet')
          const { error, message, tasks } = response
          if (error) return reject(message)

          /* Convert tasks from Object to an Array */
          const tasksArray = []
          for (const id in tasks) {
            tasksArray.push(Object.assign(tasks[id], {id}))
          }

          /* Update latest fetch */
          chrome.storage.local.set({
            latestFetch: Date.now()
          })

          return resolve(tasksArray)
        })
      })
    })
  }

  getTasks () {
    return new Promise((resolve, reject) => {
      const { access_token, username, user_id } = this.user
      if (!access_token || !username || !user_id) {
        return reject('Not authenticated')
      }

      this.getDataFromStorage().then(data => {
        /* Checking cache tasks */
        const { tasks } = data
        if (tasks && tasks.length > 0) {
          return resolve(tasks)
        }

        /* If nothing, fetch tasks from the Internet */
        this.fetchTasks()
          .then(tasks => resolve(tasks))
          .catch(e => reject(e))
      })
    })
  }

  setLike (owner_id, item_id, remove = false) {
    return new Promise((resolve, reject) => {
      console.log(this.user)

      if (!owner_id || !item_id) return reject('Not enough data')
      if (!this.user.access_token) return reject('Access token is not provided')

      const method = !remove ? 'likes.add' : 'likes.delete'

      console.log(owner_id, item_id)

      return fetch(`${API}/${method}?type=photo&owner_id=${owner_id}&item_id=${item_id}&access_token=${this.user.access_token}`)
        .then(res => res.json())
        .then(res => {
          const { error } = res
          if (error) return reject(error)

          /*
            Update latest like
          */
          console.log(Date.now())
          // chrome.storage.local.set({
          //   latestLike: Date.now()
          // })

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
