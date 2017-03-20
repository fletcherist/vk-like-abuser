(function () {
  var config = {
    apiKey: "AIzaSyB1IjoxSLvx-C_hpyQ2irgzB01Tf3bts3I",
    authDomain: "vk-free-likes.firebaseapp.com",
    databaseURL: "https://vk-free-likes.firebaseio.com",
    storageBucket: "vk-free-likes.appspot.com",
    messagingSenderId: "19336089245"
  }

  const API = 'https://api.vk.com/method'

  firebase.initializeApp(config)
  console.log('hello world')
  console.log(chrome.tabs)

  console.log(chrome.storage)
  chrome.storage.local.get(null, function (storage) {
    const { user_id, access_token, username } = storage
    if (access_token && user_id) {

      setTimeout(() => {
        like({access_token: access_token})
        // fetch(`${API}/users.get?access_token=${access_token}`)
        //   .then(r => r.json())
        //   .then(r => {
        //     console.log(r)
        //   })
      }, 10000)
    }
    console.log(storage)
  })

  function like (options) {
    const {
      owner_id = 96170043,
      item_id = 416600058,
      access_token
    } = options
    return fetch(`${API}/likes.add?type=photo&owner_id=${owner_id}&&item_id=${item_id}&access_token=${access_token}`)
      .then(r => r.json())
      .then(r => {
        console.log(r)
      })
    
  }
})()