export default function anArrayFromObject (obj) {
  const arr = []
  for (let val in obj) {
    arr.push(obj[val])
  }
  return arr
}
