const Algorithms = require('./algorithms')
const shuffleArray = require('../funcs/shuffleArray')

class Groups extends Algorithms {
  constructor () {
    super()
    this.groups = []
    
    this.peopleInGroup = 0
    this.groupsCount = 0

    this.splitIntoGroups()
    this.getTasks()

    return this.tasks
  }

  splitIntoGroups () {
    let peopleAmount = this.users.length
    this.findOptimalGroupsCount(peopleAmount)
    this.users = shuffleArray(this.users)

    for (let i = 0; i < this.groupsCount; i++) {
      this.groups.push([])
      for (let e = 0; e < this.peopleInGroup; e++) {
        this.groups[i].push(this.users[0])
        this.users.shift()
      }
    }

    return this.groups
  }

  findOptimalGroupsCount (peopleAmount) {
    if (!peopleAmount) return new Console().error('Failed to split into groups')
    if (peopleAmount < 4) {
      this.peopleInGroup = peopleAmount
      this.groupsCount = 1

      return {
        peopleInGroup: peopleAmount,
        groupsCount: 1
      }
    }
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

  getTasks () {
    let groups = this.groups
    for (let group of groups) {
      for (let i = 0; i < group.length; i++) {
        for (let e = 0; e < group.length; e++) {
          if (i !== e) {
            this.tasks.push({
              object: group[i].id,
              target: group[e].id
            })
          }
        }
      }
    }
  }
}

module.exports = Groups