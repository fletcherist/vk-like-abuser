const PEOPLE_AMOUNT = 10
const VK_API_WAIT = 1000

class Console {
  constructor (msg) {
    this.config = {
      errors: true,
      success: true,
      notifications: true
    }
  }

  error (msg) {
    if (!this.config.errors)
      return false
    console.warn('Error: ' + msg)
  }

  success (msg) {
    if (!this.config.success)
      return false
    console.log('Success: ' + msg)
  }

  notify (msg) {
    if (!this.config.notifications)
      return false
    console.log('Notification: ' + msg)
  }
}

let usersInstance = null
class Users {
  constructor () {
    if (!usersInstance) {
      this.users = {}
      this.usersCount = 0

      usersInstance = this
    }

    return usersInstance
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

  isUserExist (id) {
    if (this.findById(id) !== false) {
      return true
    }

    return false
  }

  getUsers () {
    var userList = []
    let i = 0
    for (let user in this.users) {
      i++
      userList.push(this.users[user])
    }
    this.usersCount = i
    return userList
  }
}

class User extends Users {
  constructor ({username, id}) {
    super()
    if (!id) return new Console().error('{Users} VK [id] is not provided.')
    if (!username) return new Console().error('{Users} VK [username] is not provided')
    const user = {
      id,
      username
    }

    this.users[user.id] = user
    this.usersCount++
    new Console().success(`{Users} ${user.username} joined our club!`)

    return this.user
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

let groupsInstance = null
class Groups extends Users {
  constructor () {
    super()

    if (!groupsInstance) {
      this.groups = []
      this.peopleInGroup = 0
      this.groupsCount = 0

      groupsInstance = this
    }

    return groupsInstance
  }

  destructor () {
    groupsInstance = null
  }

  showGroups () {
    console.log(this.groups)
  }

  findOptimalGroupsCount () {
    let peopleAmount = this.usersCount
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

    this.peopleInGroup = peopleInGroup
    this.groupsCount = groupsCount

    return {
      peopleInGroup,
      groupsCount
    }
  }
}

class Group extends Groups {
  constructor (users) {
    super()
    if (!users || users.length === 0) return new Console().error('{Groups}: No any users have been provided')
    for (let user of users) {
      if (!this.isUserExist(user.id)) return new Console().error('{Groups}: User does not exist')
    }

    this.groups.push(users)
  }
}

class Tests {
  generateRandomUsers () {
    for (let i = 1; i <= PEOPLE_AMOUNT; i++) {
      new User({
        id: i.toString(),
        username: i.toString()
      })
    }
  }
}

new Tests().generateRandomUsers()

const users = new Users()
const likes = new Likes()

const addLike = ({object, target}) => {
  return new Promise ((resolve, reject) => {
    setTimeout(() => {
      if (users.findById(target) && users.findById(object)) {
        likes.add({
          target: target,
          object: object
        })
      }

      resolve()
    }, VK_API_WAIT)
  })
}

console.log(users)

let people = users.getUsers()
people = shuffleArray(people)


const _groups = new Groups()

const a = new Groups()
console.log(a)

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

async function doWork () {
  for (let group of groups) {
    console.log('-----')

    for (let i = 0; i < group.length; i++) {
      for (let e = 0; e < group.length; e++) {
        if (i !== e) {
          const object = group[i].id
          const target = group[e].id

          await addLike({object, target})
        }
      }
    }
  }  
}

doWork()


console.log(likes.showLikes())


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

