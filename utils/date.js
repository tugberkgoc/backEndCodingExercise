const { format } = require('date-fns')
const config = require('config')

const formatDate = (date, dateFormat = config.date.dateFormat) => {
  return format(getLocalDate(date), dateFormat)
}

const formatDateTime = (date, dateTimeFormat = config.date.dateTimeFormat) => {
  return format(getLocalDate(date), dateTimeFormat)
}

const getCurrentDateString = (dateFormat = config.date.dateFormat) => {
  return format(getCurrentLocalDate(), dateFormat)
}

const getCurrentDateTimeString = (
  dateTimeFormat = config.date.dateTimeFormat
) => {
  return format(getCurrentLocalDate(), dateTimeFormat)
}

const getCurrentLocalDate = () => {
  return getLocalDate(new Date())
}

const getLocalDate = date => {
  const timezone = config.date.localTimeZone
  const localDate = new Date(
    Date.parse(date.toLocaleString('en-US', { timeZone: 'UTC' })) +
      timezone * 60 * 60 * 1000
  )
  return localDate
}

module.exports = {
  formatDate,
  formatDateTime,
  getCurrentDateString,
  getCurrentDateTimeString,
  getCurrentLocalDate,
  getLocalDate
}
