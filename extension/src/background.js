(function () {
  var config = {
    apiKey: "AIzaSyB1IjoxSLvx-C_hpyQ2irgzB01Tf3bts3I",
    authDomain: "vk-free-likes.firebaseapp.com",
    databaseURL: "https://vk-free-likes.firebaseio.com",
    storageBucket: "vk-free-likes.appspot.com",
    messagingSenderId: "19336089245"
  }

  const API = 'https://api.vk.com/method'

  chrome.storage.local.get(null, function (storage) {
    firebase.initializeApp(config)

    const { user_id, access_token, username,

      timeForGettingTasks,
      timeForNextTask,
      tasks

    } = storage

    if (!timeForNextTask || !timeForGettingTasks) {
      if (!timeForGettingTasks) {
        setTimeForGettingTasks()
      }

      if (!timeForNextTask) {
        setTimeForNextTask()
      }
    } else {
      // Everything is ok
      if (isReadyForGettingTasks(timeForGettingTasks)) {
        let time = Date.now() + 1000 * 120

        getTasks({user_id, access_token})
          .then(tasks => {
            console.log(tasks)
          })
          .catch(e => {
            console.log(e)
          })

        setTimeForGettingTasks(time)
      }

      if (isReadyForNewTask(timeForNextTask)) {
        setTimeout(() => {
          getTasks({user_id, access_token})
            .then(tasks => {
              if (tasks.length === 0) {
                return setTimeForNextTask(Date.now() + 1000 * 120)
              }
              const task = tasks[0]
              Tasks.doTask(task).then(r => {
                console.log(tasks)
                tasks = tasks.shift()
                Tasks.save(tasks)
                Tasks.markAsDone(task)

                return setTimeForNextTask(Date.now() + 1000 * 60)
              })
            })
        }, 1000)
      }
    }
  })

   // Listening for tasks 
    // (0 - not done yet)
    // (1 - done)
    // (2 - recieved, failure while processing)
    function getTasks (user) {
      return new Promise((resolve, reject) => {
        Tasks.getFromCache()
        .then(tasks => resolve(tasks))
        // No tasks in cache
        // Go to firebase for tasks
        .catch(e => {
          const db = firebase.database()

          const { access_token, user_id } = user

          if (!access_token || !user_id) {
            return reject('No access_token or user_id provided while getting tasks.')
          }

          const tasksLink = `/tasks/${user_id}`
          const tasksRef = db.ref(tasksLink)

          tasksRef.orderByChild('createdAt').limitToLast(100).once('value', snap => {
            if (!snap || !snap.val) return reject('Snapshot value is empty')
            let tasks = snap.val()

            if (tasks === null) {
              // Reconnect after 30 min
            } else {
              const tasksArray = []
              for (let task in tasks) {
                tasksArray.push(Object.assign({
                  key: task
                }, tasks[task]))
              }
              Tasks.save(tasksArray)
              tasksRef.off()

              return resolve(tasksArray)
            }
            // No available tasks for that moment
            // if (task === null) {
            //   updateIsReadyTimeout(1000 * 60 * 30)
            //   return false
            // }

            // const taskKey = Object.keys(task)

            // task = task[taskKey]
            // if (task && task !== null) {
            //   const { object, target, item, status } = task

            //   if (object && target && item) {
            //     like({
            //       owner_id: target,
            //       item_id: item,
            //       access_token: access_token
            //     }).then(() => {
            //       db.ref(`${tasksLink}/${taskKey}/status`)
            //         .transaction(current => 1) 
            //     }).catch(e => {
            //       db.ref(`${tasksLink}/${taskKey}`).update({
            //         status: 2,
            //         error: e.toString()
            //       })
            //     })
            //   }
            // }
          })
        })
      })
    }

    function like (options) {
      return new Promise((resolve, reject) => {
        const {
          owner_id = 96170043,
          item_id = 416600058,
          access_token
        } = options
        return fetch(`${API}/likes.add?type=photo&owner_id=${owner_id}&&item_id=${item_id}&access_token=${access_token}`)
          .then(r => r.json())
          .then(r => {
            return resolve()
          })
          .catch(e => {
            return reject(e)
          })
      })
  }

  const Tasks = {
    doTask: function (task) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve()
        }, 1000)
      })
    },
    markAsDone: function(task) {
      const db = firebase.database()
      const { item, object, target, key } = task
      if (!item || !object || !target) return false
      db.ref(`/tasks/${object}/${key}/status`)
        .transaction(currentValue => 1)
    },
    getFromCache: function () {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, storage => {
          if (!storage) return reject('Empty storage')
          const { tasks } = storage
          if (!tasks || tasks.length === 0) return reject('Invalid tasks type')
          if (!Array.isArray(tasks)) return reject('Tasks should be an array')
          return resolve(tasks)
        })
      })
    },
    save: function (tasks) {
      if (!tasks) return false
      chrome.storage.local.set({
        tasks: tasks
      })
    }
  }

  function setTimeForGettingTasks (time) {
    if (!time) time = Date.now()
    time = Number(time)

    chrome.storage.local.set({
      timeForGettingTasks: time
    })
  }

  function setTimeForNextTask (time) {
    if (!time) time = Date.now()
    time = Number(time)

    chrome.storage.local.set({
      timeForNextTask: time
    })
  }

  function isReadyForGettingTasks (timeForGettingTasks) {
    if (!timeForGettingTasks) return false

    if (timeForGettingTasks <= Date.now()) {
      return true
    }
    return false
  }

  function isReadyForNewTask (timeForNextTask) {
    if (!timeForNextTask) return false

    if (timeForNextTask <= Date.now()) {
      return true
    }
    return false
  }


  const debug = {
    isReadyForNewTask,
    isReadyForGettingTasks,
    setTimeForNextTask,
    like,
    getTasks
  }
})()