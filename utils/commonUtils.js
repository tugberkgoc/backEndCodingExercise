const addSeconds = require('date-fns/addSeconds')
const isBefore = require('date-fns/isBefore')
const ApiError = require('../models/ApiError')
const { MERGE_NOT_POSSIBLE } = require('../data/errors')

const mergeArrays = arrays => {
  if (arrays.length < 2) throw new ApiError(MERGE_NOT_POSSIBLE)

  let merged = []

  for (let i = 0; i < arrays.length - 1; i++) {
    merged = mergeTwoArrays(arrays[i], arrays[i + 1], 'brandId')
    arrays[i + 1] = merged
  }

  return merged
}

const mergeTwoArrays = (arr1, arr2, key = 'id') => {
  const merged = []

  for (let i = 0; i < arr1.length; i++) {
    merged.push({
      ...arr1[i],
      ...arr2.find(item => item[key] === arr1[i][key])
    })
  }

  return merged
}

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
  mergeArrays,
  mergeTwoArrays,
  isExpired,
  pad,
  arrayDiff,
  formatString
}
