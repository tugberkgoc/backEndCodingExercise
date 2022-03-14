const addSeconds = require('date-fns/addSeconds')
const isBefore = require('date-fns/isBefore')

const isExpired = (date, expiryInSeconds) => {
  return isBefore(addSeconds(date, expiryInSeconds), Date.now())
}

const pad = (n, width, z) => {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

const arrayDiff = (newArray, oldArray) => {
  return newArray.filter(newItem => {
    return (
      oldArray.filter(oldItem => {
        return oldItem.id === newItem.id
      }).length === 0
    )
  })
}

const formatString = (str, obj) => str.replace(/\${(.*?)}/g, (x, g) => obj[g])

module.exports = {
  isExpired,
  pad,
  arrayDiff,
  formatString
}
