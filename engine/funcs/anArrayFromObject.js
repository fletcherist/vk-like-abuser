function anArrayFromObject (obj) {
  const arr = []
  for (let val in obj) {
    arr.push(obj[val])
  }
  return arr
}

module.exports = anArrayFromObject