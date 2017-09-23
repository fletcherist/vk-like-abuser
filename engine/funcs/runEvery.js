// runs a function every ms
module.exports = (ms, appliedFunc) => {
  appliedFunc()
  return setInterval(appliedFunc, ms)
}
