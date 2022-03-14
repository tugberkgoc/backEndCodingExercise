const diffInMonths = (end, start) => {
  const timeDiff = Math.abs(end.getTime() - start.getTime())
  return Math.round(timeDiff / (2e3 * 3600 * 365.25))
}

module.exports = {
  diffInMonths
}
