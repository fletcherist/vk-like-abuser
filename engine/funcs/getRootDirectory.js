module.exports = function getRootDirectory () {
  const dirArr = __dirname.split('/')
  dirArr.splice(dirArr.length - 1, 1)
  const dir = dirArr.join('/')

  return dir
}