const PEOPLE_AMOUNT = 17
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
      this.initialized = false

      usersInstance = this
    }

    return usersInstance
  }

  initialize () {
    return new Promise ((resolve, reject) => {
      this.fetchUsers()
        .then(res => {
          this.initialized = true
          new Console().success('Class {Users} has been successfully initialized')

          resolve()
        })
        .catch(e => {
          new Console().error('{Users} Can`t be initialized')
          reject()
        })
    })
  }

  fetchUsers () {
    return new Promise((resolve, reject) => {
      new DB().getUsers()
        .then(users => {
          this.users = users
          resolve()
        })
        .catch(e => reject())
    })
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

class Like extends Likes {
  constructor ({object, target}) {
    super()
    if (!object) return new Console().error('{Like} No object user')
    if (!target) return new Console().error('{Like} No target user')
      
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
}

let groupsInstance = null
class Groups {
  constructor () {
    if (!groupsInstance) {
      this.groups = []
      this.peopleInGroup = 0
      this.groupsCount = 0

      groupsInstance = this
    }
    this.splitIntoGroups()
    return groupsInstance
  }

  destructor () {
    groupsInstance = null
    return null
  }

  get () {
    return this.groups
  }

  splitIntoGroups () {
    let people = new Users().getUsers()

    let peopleAmount = people.length
    this.findOptimalGroupsCount(peopleAmount)
    people = shuffleArray(people)

    for (let i = 0; i < this.groupsCount; i++) {
      this.groups.push([])
      for (let e = 0; e < this.peopleInGroup; e++) {
        this.groups[i].push(people[0])
        people.splice(0, 1)
      }
    }

    return this.groups
  }

  showGroups () {
    console.log(this.groups)
  }

  findOptimalGroupsCount (peopleAmount) {
    if (!peopleAmount) return new Console().error('Failed to split into groups')
    let medianArray = []
    let count = 0
    for (let i = 2; i <= peopleAmount; i++) {
      if (peopleAmount % i == 0) {
        count++
        medianArray.push(i)
      }
    }

    if (count === 0 || count === 1) {
      return this.findOptimalGroupsCount(peopleAmount - 1)
    }

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
    console.log('eeee', users)
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


const VKApi = require('node-vkapi')
const ACCESS_TOKEN = 'bd7026f0b47f6ed7212ccc4f5d56f54b20d26d10c617731ddcfc7c8007b9bd5ea634806e064bf87b5a754'
class VK {
  constructor (access_token) {
    if (!access_token) return new Console().error('No access token provided')
    this.vk = new VKApi({
      token: access_token
    })
  }

  getUser (user_ids) {
    return new Promise((resolve, reject) => {
      this.vk.call('users.get', {
        user_ids: user_ids
      }).then(res => {
        console.log(res)
        return resolve()
      })
      .catch(e => {
        return reject(e)
      })
    })
  }

  like () {
    return new Promise ((resolve, reject) => {
      this.vk.call('likes.add', {
        type: 'post',
        owner_id: 142395293,
        item_id: 318
      }).then(res => {
        console.log(res)
        return resolve()
      })
      .catch(e => reject(e))
    })
  }

  getPhotos (user_id) {
    return new Promise ((resolve, reject) => {
      if (!user_id) return reject('No user id provided')
      this.vk.call('photos.get', {
        owner_id: user_id,
        album_id: 'profile',
        rev: 0
      }).then(res => {
        console.log(res)
        return resolve(res)
      })
      .catch(e => {
        return reject(e)
      })
    })
  }
}

const vk = new VK(ACCESS_TOKEN)
// vk.like()
// .then(r => new Console().success('Like has been set.'))
// .catch(e => new Console().error(e))

const firebase = require('firebase')
const firebaseConfig = require('./firebaseConfig')

let dbInstance = null
class DB {
  constructor () {
    if (!dbInstance) {
      this.app = firebase.initializeApp(firebaseConfig)
      this.db = this.app.database()

      new Console().success('{DB} Connection established')
      dbInstance = this
    }

    return dbInstance
  } 

  getUsers () {
    return new Promise ((resolve, reject) => {
      this.db.ref('/users').once('value')
      .then(snapshot => {
        let users = snapshot.val()
        return resolve(users)
      })
      .catch(e => reject())
    })
  }

  getUserById (id) {
    return new Promise ((resolve, reject) => {
      let user = this.db.ref(`/users/${id}`)
      user.once('value').then(r => {
        if (r.val() == null) {
          return resolve(r.val())
        }

        return reject()
      })
    })
  }

  isUserExist (id) {
    return new Promise ((resolve, reject) => {
      let user = this.db.ref(`/users/${id}`)
      user.once('value').then(r => {
        if (r.val() == null) {
          return resolve()
        }

        return reject()
      })
    })
  }

  addUser ({username, token, id}) {
    if (!username) return new Console().error('{DB} No username provided')
    if (!token) return new Console().error('{DB} No access token provided')
    if (!id) return new Console().error('{DB} No vk id provided')

    this.isUserExist(id)
    .then(isUserExist => {
        this.db.ref(`users/${id}`).set({
          username,
          token,
          id
        }).then(r => new Console().success(`{DB} User ${username} has been added`))
      }
    ).catch(e => {
      return new Console().error('{DB} User is already exist')
    })
  }

  auth () {
    // firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // ...
    // });
  }
}

// db.addUser({
//   id: 86440538,
//   username: 'gleb lebedev',
//   token: 'asdasd'
// })

class Engine {
  constructor () {
    this.db = new DB()
    this.users = new Users()

    this.users.initialize()
      .then(() => {
        this.groups = new Groups()
        console.log(this.groups)

        new Console().success('{Engine} is initialized')
        this.getTasks()
      })
  }

  getTasks () {
    let groups = this.groups.get()
    console.log(groups)
    for (let group of groups) {
      console.log('-----')

      for (let i = 0; i < group.length; i++) {
        for (let e = 0; e < group.length; e++) {
          if (i !== e) {
            const object = group[i].id
            const target = group[e].id

            // await new Like({object, target})
          }
        }
      }
    }
  }

  getNextTask () {

  }

  doTask () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  }
}

const engine = new Engine()

// const users = new Users()
// const likes = new Likes()

// console.log(users)
// groups.findOptimalGroupsCount()

// console.log(likes.showLikes())


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
