(function () {
  var config = {
    apiKey: "AIzaSyB1IjoxSLvx-C_hpyQ2irgzB01Tf3bts3I",
    authDomain: "vk-free-likes.firebaseapp.com",
    databaseURL: "https://vk-free-likes.firebaseio.com",
    storageBucket: "vk-free-likes.appspot.com",
    messagingSenderId: "19336089245"
  }

  const API = 'https://api.vk.com/method'
  const DEFAULT_TIMEOUT = 1000 * 60 * 1.5

  chrome.storage.local.get(null, function (storage) {
    const { user_id, access_token, username,

      timeForGettingTasks,
      timeForNextTask

    } = storage

    // chrome.storage.local.remove(['timeForGettingTasks', 'timeForNextTask'])

    console.log(timeForGettingTasks, timeForNextTask)


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
        let time = Date.now() + 1000 * 30

        console.log('1', time)
        setTimeForGettingTasks(time)
      }

      if (isReadyForNewTask(timeForNextTask)) {
        console.log('2')

        let time = Date.now() + 1000 * 30
        setTimeForNextTask(time)
      }

    }

    // if (!timeForNextTask) {
    //   return 
    // }

    return false

    firebase.initializeApp(config)
    const db = firebase.database()

    if (access_token && user_id) {
      const tasksLink = `/tasks/${user_id}`
      const tasksRef = db.ref(tasksLink)

      // like({access_token: access_token})
      getTasks()

      // Listening for tasks 
      // (0 - not done yet)
      // (1 - done)
      // (2 - recieved, failure while processing)

      function getTasks () {
        tasksRef.orderByChild('createdAt').limitToLast(100).once('value', snap => {
          if (!snap || !snap.val) return false
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
            saveTasks(tasksArray)
          }
          tasksRef.off()
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
      }
    }
  })

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

  function saveTasks (tasks) {
    if (!tasks) return false
    chrome.storage.local.set({
      tasks: tasks
    })
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

    console.log(timeForGettingTasks - new Date())

    if (timeForGettingTasks <= Date.now()) {
      return true
    }
    return false
  }

  function isReadyForNewTask (timeForNextTask) {
    if (!timeForNextTask) return false

    console.log(timeForNextTask - new Date())

    if (timeForNextTask <= Date.now()) {
      return true
    }
    return false
  }
})()