chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
      'url': chrome.extension.getURL('index.html'), 'selected': true
    })
})

var config = {
  apiKey: "AIzaSyB1IjoxSLvx-C_hpyQ2irgzB01Tf3bts3I",
  authDomain: "vk-free-likes.firebaseapp.com",
  databaseURL: "https://vk-free-likes.firebaseio.com",
  storageBucket: "vk-free-likes.appspot.com",
  messagingSenderId: "19336089245"
}

firebase.initializeApp(config)

let ACCESS_TOKEN = localStorage.getItem('access_token')
let MY_ID = localStorage.getItem('user_id')

Vue.use(VueFire)
let db = firebase.database()

let users = db.ref('/users').limitToFirst(20)
let me = db.ref(`/users/${MY_ID}`)
let stats = db.ref(`/statistics/${MY_ID}`)
let likes = db.ref('/likes').limitToLast(10)
let tasks = db.ref(`/tasks/${MY_ID}`)

let globalStats = db.ref('/global_stats')

Vue.component('global-stats', {
  template: `
    <div class='global-stats'>
      <div class='global-stats__stat'>
        <div class='stat__desc'>Пользователей</div>
        <div class='stat__value'>{{allUsers}}</div>
      </div>
      <div class='global-stats__stat'>
        <div class='stat__desc'>Лайков поставлено</div>
        <div class='stat__value'>{{allLikes}}</div>
      </div>
    </div>
  `,
  firebase: {
    globalStats: {
      source: globalStats,
      asObject: true
    }
  },
  computed: {
    loaded: function () {
      if (this.globalStats && this.globalStats.users) {
        return true
      }
      return false
    },
    allLikes: function () {
      if (this.globalStats.likes &&
          this.globalStats.likes.all) {
        return formatNumber(this.globalStats.likes.all)
      }
      return 0
    },

    allUsers: function () {
      if (this.globalStats.users &&
          this.globalStats.users.total) {
        return formatNumber(this.globalStats.users.total)
      }
      return 0
    }
  }
})

Vue.component('stats', {
  template: `
    <div>
      <h1>Общая статистика</h1>
      <div class='stats__item'>Пользователей: <b>{{allUsers}}</b></div>
      <div class='stats__item'>Лайков поставлено: <b>{{allLikes}}</b></div>
    </div>
  `,
  firebase: {
    users: users,
    globalStats: {
      source: globalStats,
      asObject: true
    }
  },
  computed: {
    yourContribution: function () { 
      return 23
    },

    allLikes: function () {
      if (this.globalStats.likes &&
          this.globalStats.likes.all) {
        return formatNumber(this.globalStats.likes.all)
      }
      return 0
    },

    allUsers: function () {
      if (this.globalStats.users &&
          this.globalStats.users.total) {
        return formatNumber(this.globalStats.users.total)
      }
      return 0
    }
  }
})

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}

new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})

function getRealtimeLikesFromCache () {
  try {
    const realtimeLikes = JSON.parse(localStorage.getItem('realtime_likes'))
    return realtimeLikes
  } catch (e) {
    return []
  }
}

const fromCache = {
  username: {
    get: function () {
      const username = localStorage.getItem('username')
      if (username !== undefined || username !== null) {
        return username
      }

      return undefined
    },
    set: function (username) {
      localStorage.setItem('username', username)
      return username
    }
  },
  photo_100: {
    get: function () {
      const photo_100 = localStorage.getItem('photo_100')
      if (photo_100 !== undefined || photo_100 !== null) {
        return photo_100
      }

      return undefined
    },
    set: function (photo_100) {
      localStorage.setItem('photo_100', photo_100)
      return photo_100
    }
  },
  access_token: {
    get: function () {
      const access_token = localStorage.getItem('access_token')
      if (access_token !== undefined || access_token !== null) {
        return access_token
      }
      return undefined
    },
    set: function (access_token) {
      localStorage.setItem('access_token', access_token)
    }
  },
  user_id: {
    get: function () {
      const user_id = localStorage.getItem('user_id')
      if (user_id !== undefined || user_id !== null) {
        return user_id
      }
      return undefined
    },
    set: function (user_id) {
      localStorage.setItem('user_id', user_id)
    }
  }
}

const chromeStorage = {
  updateData: function () {
    chrome.storage.local.set({
      username: fromCache.username.get(),
      access_token: fromCache.access_token.get(),
      user_id: fromCache.user_id.get()
    }, function (storage) {})
  }
}

chromeStorage.updateData()

Vue.component('realtime-likes', {
  template: `
    <div class='realtime-likes'>
        <div class="realtime-likes__name">Лайки в реальном времени</div>
        <div v-if='isLoaded'>
          <div v-for='like in getLikes' transition="bounce" class="realtime-likes__like">
            <div :key='like.item' class="realtime-likes__container">
              <a href='https://vk.com/id{{like.object.id}}' target='_blank'>
                <img :src='like.object.photo_100' class='realtime-likes__photo' />
              </a>
              <svg class="realtime-likes__arrow" fill="#55677d" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
              <a href='https://vk.com/id{{like.target.id}}' target='_blank'>
                <img :src='like.target.photo_100' class='realtime-likes__photo' />
              </a>
            </div>
          </div>
        </div>
        <div v-else class="realtime-likes__preloader">
          <preloader></preloader>
        </div>
      </div>
    </div>
  `,
  data: function () {
    return {
      realtimeLikes: getRealtimeLikesFromCache
    }
  },
  firebase: {
    realtimeLikes: db.ref('/realtime_likes')
  },
  computed: {
    getLikes: function () {
      if (this.realtimeLikes && this.realtimeLikes.length > 0) {
        let likes = this.realtimeLikes.slice(this.realtimeLikes.length - 5).reverse()
        return likes
      }

      return []
      console.log(this.likes)
      return 'NO!'
    },
    isLoaded: function () {
      if (this.realtimeLikes && this.realtimeLikes.length > 0) {
        return true
      }
      return false
    }
  }
})

Vue.component('donate', {
  template: `
    <div>
      <h1>Пожертвования</h1>
      <div>
        Пожертвование — это хороший способ поддержать разработчиков и 
        <b>сделать вклад</b> в развитие проекта. Деньги идут на покупку рекламы.
      </div>
      <b><a href='https://vk.com/app5727453_-116428466' target='_blank'>Пожертвовать!</a></b>
    </div>
  `
})


const faq = [
  {
    title: 'Нет заданий',
    description: 
      `Площадки с заданиями — прошлый век.
        Мы все здесь автоматизировали. Больше не надо 
        ставить кому-то лайки самому. Люди ставят лайки вам,
        а Вы — им. Автоматически.`
  },
  {
    title: 'Могут ли заморозить?',
    description: 
      `ВКонтакте могут. Размораживайтесь, при этом 
      обязательно пишите нам, если такое вдруг случится. 
      Это важно, чтобы расширение было как можно безопаснее.
      `
  },
  {
    title: 'Хьюстон?',
    description: `Ничего не работает? Все вопросы и предложения 
      можно задать прямо разработчикам.`,
    additionHtml: `
      <div class='developers'>
        <div class='developers__developer'>
          <a href='https://vk.com/im?sel=96170043' target='_blank'>Фил Романов</a>
          и 
          <a href='https://vk.com/im?media=&sel=142395293' target='_blank'>Никита Жуков</a>
          попробуют помочь
        </div>
      </div>
    `
  }
]

const howItWorks = Vue.component('faq', {
  template: `
    <div class='faq'>
      <div v-for='item in faq'>
        <h1>{{item.title}}</h1>
        <div>{{item.description}}</div>
        {{{item.additionHtml}}}
      </div>
    </div>
  `,
  data: function () {
    return {
      faq
    }
  },

  computed: {
    isFaqOpened: function () {
      console.log(this.isOpened)
      if (this.isOpened === true) {
        return 'Свернуть'
      }
      return 'Развернуть'
    }
  }
})

Vue.component('main-navigation', {
  template: `
    <div class='navigation'>
      <div class='navigation__buttons'>
        <div
          @click='setCurrentPage(1)'
          class='navigation__button'
          v-bind:class="{
            'navigation__button--selected': this.currentPage === 1,
            'navigation__button--not-selected': this.currentPage !== 0
          }">FAQ</div>
        <div
          @click='setCurrentPage(2)'
          class='navigation__button'
          v-bind:class="{
            'navigation__button--selected': this.currentPage === 2,
            'navigation__button--not-selected': this.currentPage !== 0
          }">Donate</div>
        <div
          @click='setCurrentPage(3)'
          class='navigation__button'
          v-bind:class="{
            'navigation__button--selected': this.currentPage === 3,
            'navigation__button--not-selected': this.currentPage !== 0
          }">Статистика</div>
      </div>
      <div v-if='this.currentPage === 1'>
        <faq></faq>
      </div>
      <div v-if='this.currentPage === 2'>
        <donate></donate>
      </div>
      <div v-if='this.currentPage === 3'>
        <stats :users='123' :likes='3223'></stats>
      </div>
    </div>
  `,
  data: function () {
    return {
      currentPage: 0
    }
  },
  methods: {
    setCurrentPage: function (page) {
      if (page === this.currentPage) {
        this.currentPage = 0
        return
      }
      this.currentPage = page
    }
  },

  computed: {
    isCurrentPage: function (page) {
      return this.currentPage === page
    }
  }
})

Vue.component('need-validation', {
  template: `
    <div>
      <h2>Не удалось авторизоваться до конца</h2>
      <div>
        Если вы видите эту ошибку, значит <b>что-то пошло не так</b>.
        Наши сервера находятся в России, и если Вы заходите не с российского 
        <b>IP-адреса</b>, ВКонтакте просит пройти дополнительную проверку.
      </div>
      <div class='rate-empty-line'></div>
      <div class='button'>Продолжить авторизацию</div>
    </div>
  `
})

let app = new Vue({
  el: '#app',
  data: () => {
    return {
      message: 'Hey',
      authorized: MY_ID ? true : false,
      activated: false,
      agreedWithTerms: false,
      loaded: false
    }
  },
  firebase: {
    me: {
      source: me,
      asObject: true
    },
    stats: {
      source: stats,
      asObject: true
    }
  },
  methods: {
    toggle: function () {
      this.activated = !this.activated

      me.update({
        isActive: this.activated
      })
    },
    logout: function () {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('username')
      localStorage.removeItem('photo_100')

      firebase.auth().signOut()

      chrome.tabs.reload()
    }
  },
  computed: {
    isLoaded: function () {
      if (this.me && this.me.id) {
        this.loaded = true
        return true
      }
      return false
    },
    username: function () {
      if (this.me && this.me.username) {
        fromCache.username.set(this.me.username)
        return this.me.username
      }

      return fromCache.username.get()
    },
    photo_100: function () {
      if (this.me && this.me.photo_100) {
        fromCache.photo_100.set(this.me.photo_100)
        return this.me.photo_100
      }

      return fromCache.photo_100.get()
    },
    needValidation: function () {
      console.log(this.me.need_validation)
      if (this.me && this.me.need_validation === 1) {
        return true
      }

      return false
    }
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (ACCESS_TOKEN) {
    return false
  }
  const url = changeInfo.url
  if (url) {
    const tokenRegex = /access_token=([a-zA-Z0-9]+)/
    const userIdRegex = /user_id=([0-9]+)/

    let accessToken = url.match(tokenRegex)
    let userId = url.match(userIdRegex)
    if (accessToken && userId) {
      accessToken = accessToken[1]
      userId = userId[1]

      chrome.tabs.remove(tabId)

      db.ref(`/token_fabrique/${accessToken}`).set({
        access_token: accessToken,
        id: userId,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        success: 0
      })

      chrome.tabs.reload()

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('user_id', userId)
      localStorage.setItem('username', userId)
    }
  }
})

const login = fromCache.access_token.get()
  ? fromCache.access_token.get() + '@likeabuser.com'
  : undefined

firebase.auth().onAuthStateChanged(user => {
  if (!user && login) {
    firebase.auth().signInWithEmailAndPassword(login, login).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // Create user account
      if (errorCode === 'auth/user-not-found') {
        firebase.auth().createUserWithEmailAndPassword(login, login).catch(function(error) {
          var errorCode = error.code
          var errorMessage = error.message
        }).then(r => {
          window.location.reload()
        })
      }
    }).then(r => {
      console.log('[auth] success')
    })
  }
})

me.once('value', snap => {
  console.log(snap.val())
}, e => {
  console.log(e)
})
