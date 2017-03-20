(function () {
  var config = {
    apiKey: "AIzaSyB1IjoxSLvx-C_hpyQ2irgzB01Tf3bts3I",
    authDomain: "vk-free-likes.firebaseapp.com",
    databaseURL: "https://vk-free-likes.firebaseio.com",
    storageBucket: "vk-free-likes.appspot.com",
    messagingSenderId: "19336089245"
  }

  const API = 'https://api.vk.com/method'
  const TASKS_LATENCY = 1.5

  chrome.storage.local.get(null, function (storage) {
    const { user_id, access_token, username, latestLike } = storage

    if (!latestLike) {
      return updateLatestLike()
    } else {
      if (!isReadyForTask(latestLike)) {
        return false
      }
    }

    firebase.initializeApp(config)
    const db = firebase.database()

    if (access_token && user_id) {
      const tasksLink = `/tasks/${user_id}`
      const tasks = db.ref(tasksLink)

      // like({access_token: access_token})
      getTasks()

      // Listening for tasks 
      // (0 - not done yet)
      // (1 - done)
      // (2 - recieved, failure while processing)

      function getTasks () {
        tasks.orderByChild('createdAt').limitToLast(1).once('value', snap => {
          if (!snap || !snap.val) return false
          let task = snap.val()
          // No available tasks for that moment
          if (task === null) {
            return false
          }
          const taskKey = Object.keys(task)

          task = task[taskKey]
          if (task && task !== null) {
            const { object, target, item, status } = task

            if (object && target && item) {
              like({
                owner_id: target,
                item_id: item,
                access_token: access_token
              }).then(() => {
                db.ref(`${tasksLink}/${taskKey}/status`)
                  .transaction(current => 1) 
              }).catch(e => {
                db.ref(`${tasksLink}/${taskKey}`).update({
                  status: 2,
                  error: e.toString()
                })
              })
            }
          }
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

  function updateLatestLike () {
    chrome.storage.local.set({
      latestLike: Number(new Date())
    }, function (storage) {})
  }

  function isReadyForTask (latestLike) {
    if (typeof latestLike === 'object') {
      updateLatestLike()
      return false
    }
    // in ms
    let diff = new Date() - new Date(latestLike)
    // in s
    diff /= 1000
    // in m
    diff /= 60

    if (diff >= TASKS_LATENCY) {
      return true
    }

    return false
  }
})()