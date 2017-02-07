class Console {
  constructor (msg) {

  }

  error (msg) {
    console.warn('Error: ' + msg)
  }

  success (msg) {
    console.log('Success: ' + msg)
  }

  notify (msg) {
    console.log('Notification: ' + msg)
  }
}

class Users {
  constructor () {
    this.users = {

    }
  }

  add ({id, username}) {
    if (!id) return new Console().error('{Users} VK [id] is not provided.')
    if (!username) return new Console().error('{Users} VK [username] is not provided')
    const user = {
      id,
      username
    }

    this.users[user.id] = user
    new Console().success(`{Users} ${user.username} joined our club!`)

    return this.user
  }

  showUsers () {
    for (let user in this.users) {
      console.log(this.users[user].id)
    }
  }

  findById (id) {
    if (!id) return new Console().error('{Users} [id] is not provided.')

    if (typeof this.users[id] !== 'undefined') {
      return this.users[id]
    } else {
      new Console().notify(`{Users} User with id ${id} not found`)
      return false
    }
  }

  getUsers () {
    var userList = []
    for (let user in this.users) {
      userList.push(this.users[user])
    }
    return userList
  }
}


class Likes {
  constructor () {
    this.likes = {

    }
  }

  add ({target, object}) {
    if (!target) return new Console().error('{Likes} target id is not provided')
    if (!object) return new Console().error('{Likes} object id is not provided')

    const like = {
      target,
      object
    }

    this.likes[target] = like
    return new Console().success('{Likes} like has been added')
  }

  showLikes () {
    console.log(this.likes)
  }
}

const users = new Users()
const likes = new Likes()

const addLike = ({object, target}) => {
  if (users.findById(target) && users.findById(object)) {
    likes.add({
      target: target,
      object: object
    })
  }
}

const PEOPLE_AMOUNT = 10

for (let i = 1; i <= PEOPLE_AMOUNT; i++) {
  users.add({
    id: i.toString(),
    username: i.toString()
  })
}

let people = users.getUsers()
people = shuffleArray(people)

const a = getGroups(people.length)

console.log(people)
console.log(a)

const groups = []

const { groupsCount, peopleInGroup } = a

for (let i = 0; i < groupsCount; i++) {
  groups.push([])
  for (let e = 0; e < peopleInGroup; e++) {
    groups[i].push(people[0])
    people.splice(0, 1)
  }
}


for (let group of groups) {
  console.log('-----')

  for (let i = 0; i < group.length; i++) {
    for (let e = 0; e < group.length; e++) {
      if (i !== e) {
        const object = group[i].id
        const target = group[e].id

        addLike({object, target})
      }
    }
  }
}



console.log(likes.showLikes())



function getGroups (peopleAmount) {
  if (!peopleAmount) return new Console().error('Failed to split into groups')
  let medianArray = []
  let count = 0
  for (let i = 2; i <= peopleAmount; i++) {
    
    if (peopleAmount % i == 0) {
      count++
      medianArray.push(i)
    }
  }
  console.log('count', count)
  console.log(medianArray)

  const peopleInGroup = medianArray[Math.floor(medianArray.length / 2)]
  const groupsCount = peopleAmount / peopleInGroup

  return {
    peopleInGroup,
    groupsCount
  }
}

function shuffleArray (arr) {
  let i = arr.length
  while (i > 0) {
    i--
    let e = Math.floor(Math.random() * arr.length)
    let k = Math.floor(Math.random() * arr.length)

    let tmp = arr[e]
    arr[e] = arr[i]
    arr[i] = tmp

  }
  return arr
}

