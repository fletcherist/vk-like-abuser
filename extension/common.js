chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
      'url': chrome.extension.getURL('index.html'), 'selected': true
    });
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

let users = db.ref('/users')
let me = db.ref(`/users/${MY_ID}`)
let stats = db.ref(`/statistics/${MY_ID}`)
let pushes = db.ref('/pushes')
let likes = db.ref('/likes')

let globalStats = db.ref('/global_stats')

Vue.component('stats', {
  template: `
    <div class='stats'>
      <h1>Общая статистика</h1>
      <div class='stats__item'>Всего лайков поставлено: <b>{{globalStats.likes.all}}</b></div>
      <div class='stats__item'>Пользователей в расширении: <b>{{globalStats.users.total}}</b></div>
      <div class='stats__item'>Ваш вклад: {{yourContribution}}%</div>
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
    }
  }
})

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

function getUsernameFromCache () {

}

const fromCache = {
  username: {
    get: function () {
      const username = localStorage.getItem('username')
      if (username !== undefined || username !== null) {
        return username
      }

      return 'загрузка..'
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

      return 'загрузка..'
    },
    set: function (photo_100) {
      localStorage.setItem('photo_100', photo_100)
      return photo_100
    }
  }
}

Vue.component('realtime-likes', {
  template: `
    <div class='realtime-likes'>
      <div class="realtime-likes__name">Лайки в реальном времени</div>
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
  `,
  data: function () {
    return {
      realtimeLikes: getRealtimeLikesFromCache
    }
  },
  firebase: {
    realtimeLikes: db.ref('/realtime_likes')
  },
  mounted: function () {
    console.log('realtime-t')
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
    }
  }
})

Vue.component('help', {
  template: `
    <div class='help'>
      <div class='help__group'>
        <a href='https://vk.com/vk_king_likes' target='_blank'>Группа ВКонтакте</a>
      </div>
    </div>
  `
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

const activateButton = {
  template: `
    <div class='activate'>
      <div class='button button__activate button--center' v-on:click="toggle()">
        <span v-if='me.isActive'>Приостановить</span>
        <span v-else>Начать</span>
      </div>
    </div>
  `
}

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
    },
    pushes: pushes
  },
  methods: {
    toggle: function () {
      this.activated = !this.activated

      me.update({
        isActive: this.activated
      })
    },
    logout: function () {
      console.log('logout')
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('username')

      chrome.tabs.reload()
    }
  },
  computed: {
    isLoaded: function () {
      if (this.me && this.me.id) {
        this.loaded = true
        alert('loaded')
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
    }
  },
  components: {
    'activate-button': activateButton
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

      db.ref(`users/${userId}`).set({
        username: userId,
        access_token: accessToken,
        id: userId,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      })

      chrome.tabs.reload()

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('user_id', userId)
      localStorage.setItem('username', userId)
    }
  }
})

const nodes = []
const links = []
const usersTable = {}

users.once('value', __users => {
  likes.once('value', __likes => {
    const _users = __users.val()
    const _likes = __likes.val()

    let usersIncrementId = 0
    let limit = 15

    for (let user in _users) {
      if (usersIncrementId > limit) {
        break
      }
      if (_users[user].id) {
        nodes.push(_users[user])
        usersTable[user] = usersIncrementId
        usersIncrementId++
      }
    }

    restart()
    setTimeout(() => {
      let i = 0
      for (let sourceUserId in _likes) {
        if (i > Math.PI * limit) {
          break
        }
        for (let targetUserId in _likes[sourceUserId]) {
          let source = usersTable[sourceUserId]
          let target = usersTable[targetUserId]
          if (source && target) {
            addToLinks({
              source,
              target
            })
          }
          i++
        }
      }
    }, 500)
      
  })
})

let delayTimeout = 200
let addToLinks = obj => {
  setTimeout(() => {
    const { source, target } = obj
    if (!source || !target) {
      return false
    }
    links.push(obj)
    restart()
  }, delayTimeout)
  delayTimeout += 100
}

users.on('child_changed', snap => {
  let userId = snap.val().id
  nodes[usersTable[userId]].isActive = !nodes[usersTable[userId]].isActive
  restart()
})


const svg = d3.select("svg#graph")

const width = window.innerWidth
const height = window.innerHeight

svg
  .attr('width', width)
  .attr('height', height)


var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-3000))
    .force('link', d3.forceLink(links).distance(width/Math.PI))
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .alphaTarget(1)
    .on('tick', ticked);

var g = svg.append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
let link = g.append('g')
  .attr('stroke', 'rgba(255, 255, 255, .7)')
  .attr('stroke-width', 1)
  .selectAll('.link')
let node = g.append('g')
  .attr('stroke', 'rgba(0, 0, 0, 1)')
  .attr('stroke-width', 2)
  .selectAll('.node')

const picSize = 50
const picDiff = - picSize / 2

d3.select('circle').on('click', e => {
  console.log(e)
})

function restart() {

  // Apply the general update pattern to the nodes.
  node = node.data(nodes, d => d.id)
  node.exit().remove()

  let defs = node.append('svg:defs')

  node.enter().append('svg:pattern')
    .attr('id', d => d.id)
    .attr('width', picSize)
    .attr('height', picSize)
    .attr('patternUnits', 'userSpaceOnUse')
    .append('svg:image')
    .attr('xlink:href', d => d.photo_50)
    .attr('width', picSize - 5)
    .attr('height', picSize)
    .attr('x', 0)
    .attr('y', 0)

  node = node.enter().append("circle")
    .attr('cx', picDiff)
    .attr('cy', picDiff)
    .attr('r', 16)
    .attr('stroke', d => d.isActive ? '#66bb6a' : 'white')
    .style('fill', d => {
      
      return 'green'
    })
    .style('fill', d => `url(#${d.id})`).merge(node)

  link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; })
  link.exit().remove()
  link = link.enter().append("line").merge(link)

  simulation.force("link").links(links);
  simulation.nodes(nodes);
  simulation.alpha(1).restart();
}

function ticked() {
  node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  node.attr('x', d => d.x)
  node.attr('y', d => d.y)

  link.attr('x1', d => d.source.x + picDiff)
      .attr('y1', d => d.source.y + picDiff)
      .attr('x2', d => d.target.x + picDiff)
      .attr('y2', d => d.target.y + picDiff)
}
