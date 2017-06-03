const EXTENSION_ID = chrome.runtime.id
const API = 'https://api.vk.com/method'
const ENV = 'DEBUG'
// const env = 'PRODUCTION'

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

class Background {
  constructor () {
      this.config = {
        socketServer: ENV === 'PRODUCTION'
          ? 'https://fletcherist.com'
          : 'http://localhost:80'
      }
      this.socket = io(this.config.socketServer)
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
          return reject()
        }

        self.socket.on('connect', () => {
          console.log('connected')
        })
        self.socket.emit('get_tasks', {
          user_id
        }, response => {
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
}

const background = new Background()
background.getTasks()

// socket.on('connect', () => {})
// socket.on('event', () => {})
// socket.on('disconnect', () => {})
// socket.emit('path', {
//   path: document.location.href.toString()
// }, data => {
//   console.log(data)
// })
// socket.on('news', news => {
//   console.log(news)
// })


console.log(io)
