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
}

const users = new Users()
const likes = new Likes()


const addLike = ({target, object}) => {
  if (users.findById(target) && users.findById(object)) {
    likes.add({
      target: target,
      object: object
    })
  }
}



function getPeople () {
  const peopleAmount = 1000

  for (let i = 1; i <= peopleAmount; i++) {
    users.add({
      id: i.toString(),
      username: i.toString()
    })
  }
  
  let arr = []
  let count = 0
  for (let i = 2; i < peopleAmount; i++) {
    
    if (peopleAmount % i == 0) {
      count++
      arr.push(i)
    }
  }

  const groupCountValue = arr[Math.round(arr.length / 2)]
  const groupsCount = peopleAmount / groupCountValue
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

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
shuffleArray(arr)
console.log(arr)


// console.log(users.findById('500'))



users.showUsers()
