const fromCache = {
  username: {
    get: function () {
      const username = localStorage.getItem('username')
      if (username) {
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
      if (photo_100) {
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
      if (access_token) {
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
      if (user_id) {
        return user_id
      }
      return undefined
    },
    set: function (user_id) {
      localStorage.setItem('user_id', user_id)
    }
  },
  server: {
    get: function () {
      const server = localStorage.getItem('server')
      return server
    },
    set: function (serverId) {
      localStorage.setItem('server', serverId)
    } 
  }
}