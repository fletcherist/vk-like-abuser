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

let users = db.ref('users')
let me = db.ref(`users/${MY_ID}`)
let stats = db.ref(`statistics/${MY_ID}`)
let pushes = db.ref('pushes')
let likes = db.ref('likes')

let app = new Vue({
  el: '#app',
  data: () => {
    return {
      message: 'Hey',
      authorized: MY_ID ? true : false,
      activated: false,
      agreedWithTerms: false
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
  }
})

let usersVue = new Vue({
  el: '#users',
  data: () => {
  },
  firebase: {
    users: users,
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


users..once('value', __users => {
  likes.once('value', __likes => {
    const _users = __users.val()
    const _likes = __likes.val()

    
    let usersIncrementId = 0
    for (let user in _users) {
      nodes.push(_users[user])
      usersTable[user] = usersIncrementId
      usersIncrementId++
    }

    restart()
    setTimeout(() => {
      for (let sourceUserId in _likes) {
        for (let targetUserId in _likes[sourceUserId]) {
          addToLinks({
            source: usersTable[sourceUserId],
            target: usersTable[targetUserId]
          })
        }
      }
    }, 500)
      
  })
})

let delayTimeout = 200
let addToLinks = obj => {
  setTimeout(() => {
    links.push(obj)
    restart()
  }, delayTimeout)
  delayTimeout += 50
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
    .force('charge', d3.forceManyBody().strength(-1900))
    .force('link', d3.forceLink(links).distance(240))
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
