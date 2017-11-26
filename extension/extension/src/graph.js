const nodes = []
const links = []
const usersTable = {}

const _users = {
  "4830274": {
    "id": 4830274,
    "isActive": true,
    "isValid": true,
    "latestLike": 1490553056579,
    "need_validation": 0,
    "photo_100": "https://pp.userapi.com/c625222/v625222274/4ece0/Laol0YhJVeM.jpg",
    "photo_50": "https://pp.userapi.com/c625222/v625222274/4ece1/Tm5dNbBdz9s.jpg",
    "username": "Roman Matskevich"
  },
  "7496224": {
    "id": 7496224,
    "isActive": true,
    "photo_100": "https://pp.userapi.com/c636524/v636524224/4a7df/qBywV8IErwU.jpg",
    "photo_50": "https://pp.userapi.com/c636524/v636524224/4a7e0/WzYPCkXfud0.jpg",
    "success_auth": 1,
    "username": "Сергей Кузин"
  },
  "30681826": {
    "id": "30681826",
    "isActive": true,
    "isValid": true,
    "latestLike": 1490552842399,
    "photo_100": "https://pp.userapi.com/c638724/v638724826/29976/nKYMGaEwpfA.jpg",
    "photo_50": "https://pp.userapi.com/c638724/v638724826/29977/cf6xE3_Yj1o.jpg",
    "username": "Андрей Лазарев"
  },
  "60856694": {
    "id": "60856694",
    "isActive": true,
    "isValid": true,
    "latestLike": 1490552851326,
    "photo_100": "https://pp.userapi.com/c636923/v636923694/3eafc/63U0fBQVgKA.jpg",
    "photo_50": "https://pp.userapi.com/c636923/v636923694/3eafd/TczwfL-HeAc.jpg",
    "username": "Никита Колочков"
  },
  "64340131": {
    "id": "64340131",
    "isActive": true,
    "isValid": true,
    "latestLike": 1490552860651,
    "photo_100": "https://pp.userapi.com/c636324/v636324131/5a302/i1U7U0Q3GoE.jpg",
    "photo_50": "https://pp.userapi.com/c636324/v636324131/5a303/B4PexQOBupw.jpg",
    "username": "Максим Гайсин"
  },
  "70267059": {
    "id": 70267059,
    "isActive": true,
    "isValid": true,
    "latestLike": 1490552881781,
    "need_validation": 0,
    "photo_100": "https://pp.userapi.com/c626229/v626229059/59ae5/3bWXlPsdsiA.jpg",
    "photo_50": "https://pp.userapi.com/c626229/v626229059/59ae6/qx15S20oxWU.jpg",
    "success_auth": 1,
    "username": "Всеволод Деткин"
  },
  "74517317": {
    "id": "74517317",
    "isActive": true,
    "isValid": true,
    "latestLike": 1490552883095,
    "photo_100": "https://pp.userapi.com/c637916/v637916317/347c7/UGIreQ9edHE.jpg",
    "photo_50": "https://pp.userapi.com/c637916/v637916317/347c8/wyyQsfh8RZs.jpg",
    "username": "Макс Танашев"
  },
  "80887318": {
    "id": 80887318,
    "isActive": true,
    "isValid": true,
    "latestLike": 1490552887590,
    "need_validation": 0,
    "photo_100": "https://pp.userapi.com/c626629/v626629318/431f8/8bvSdlmNk5c.jpg",
    "photo_50": "https://pp.userapi.com/c626629/v626629318/431f9/yLEgjMgNxK8.jpg",
    "success_auth": 1,
    "username": "Антон Петров"
  },
  "81044735": {
    "id": "81044735",
    "isActive": true,
    "isValid": true,
    "latestLike": 1490552899866,
    "photo_100": "https://pp.userapi.com/c836323/v836323735/20f24/AcOmkFwLlz4.jpg",
    "photo_50": "https://pp.userapi.com/c836323/v836323735/20f25/iLN3yLRSstY.jpg",
    "username": "Максим Мамонтов"
  },
  "86440538": {
    "id": "86440538",
    "isActive": true,
    "isValid": true,
    "latestLike": 1490552906610,
    "photo_100": "https://pp.userapi.com/c604728/v604728538/2a9b1/WAcKOY7R82I.jpg",
    "photo_50": "https://pp.userapi.com/c604728/v604728538/2a9b2/pk-cC-ToqTg.jpg",
    "username": "Глеб Лебедев"
  },
  "88114783": {
    "floodControl": 1490471299614,
    "id": 88114783,
    "isActive": true,
    "isValid": true,
    "latestLike": 1490552729942,
    "need_validation": 0,
    "photo_100": "https://pp.userapi.com/c637523/v637523783/1bdda/XQHmMevPXw4.jpg",
    "photo_50": "https://pp.userapi.com/c637523/v637523783/1bddb/p5bpk27PEl0.jpg",
    "success_auth": 1,
    "username": "Влад Петренко"
  }
}

setTimeout(() => {
  const usersArray = Object.keys(_users)

  let usersIncrementId = 0
  let limit = 10

  for (let user in _users) {
    if (usersIncrementId > limit) {
      break
    }
    if (_users[user].id && _users[user].photo_50) {
      nodes.push(_users[user])
      usersTable[user] = usersIncrementId
      usersIncrementId++
    }
  }

  restart()
  setTimeout(() => {
      for (let i = 0; i < usersIncrementId; i++) {
        for (let e = 1; e < usersIncrementId; e++) {
          let source = usersTable[usersArray[i]]
          let target = usersTable[usersArray[e]]

          let chance = Math.random() > 0.5

          if (source && target && chance) {
            addToLinks({source, target})
          }
        }
      }
  }, 1000)
}, 2000)


let delayTimeout = 800
let addToLinks = obj => {
  setTimeout(() => {
    const { source, target } = obj
    if (!source || !target) {
      return false
    }
    links.push(obj)
    restart()
  }, delayTimeout)
  delayTimeout += 500
}

const svg = d3.select("svg#graph")

const width = window.innerWidth
const height = window.innerHeight

svg
  .attr('width', width)
  .attr('height', height)


var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-3000))
    .force('link', d3.forceLink(links).distance(width/Math.PI + 100))
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
