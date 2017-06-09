const EXTENSION_ID = chrome.runtime.id
const API = 'https://api.vk.com/method'
const VK_ABUSER_API_PRODUCTION = 'https://vkabuser.fletcherist.com'
const VK_ABUSER_API_DEVELOPMENT = 'http://localhost:80'
const ENV = 'DEBUG'
// const ENV = 'PRODUCTION'

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
class Background {
  constructor () {
      this.config = {
        socketServer: ENV === 'PRODUCTION'
          ? VK_ABUSER_API_PRODUCTION
          : VK_ABUSER_API_DEVELOPMENT
      }
      this.socket = io(this.config.socketServer)

      this.processing()
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
  }

  /*
    This method is responsible for getting tasks
    from api infrastructure
  */
  getTasks () {
    const self = this
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, function (storage) {
        const { access_token, username, user_id } = storage
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


  setLike (options) {
    return new Promise((resolve, reject) => {
      const {
        owner_id = 96170043,
        item_id = 416600058,
        access_token
      } = options
      return fetch(`${API}/likes.add?type=photo&owner_id=${owner_id}&&item_id=${item_id}&access_token=${access_token}`)
        .then(r => r.json())
        .then(r => {
          return resolve('Like has been set')
        })
        .catch(e => {
          return reject(e)
        })
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
//
// function setTimeForGettingTasks (time) {
//   if (!time) time = Date.now()
//   time = Number(time)
//
//   chrome.storage.local.set({
//     timeForGettingTasks: time
//   })
// }
//
// function setTimeForNextTask (time) {
//   if (!time) time = Date.now()
//   time = Number(time)
//
//   chrome.storage.local.set({
//     timeForNextTask: time
//   })
// }
//
// function isReadyForGettingTasks (timeForGettingTasks) {
//   if (!timeForGettingTasks) return false
//
//   if (timeForGettingTasks <= Date.now()) {
//     return true
//   }
//   return false
// }
//
// function isReadyForNewTask (timeForNextTask) {
//   if (!timeForNextTask) return false
//
//   if (timeForNextTask <= Date.now()) {
//     return true
//   }
//   return false
// }

const background = new Background()
