const moment = require('moment')

const _log = (type, colorBg, colorFg, args) => {
	const resetColors = '\x1b[0m'
	const currentTime = new moment().format('YYYY-MM-DD hh:mm:ss')
	console.log(currentTime, ' - ', colorBg, colorFg, type, resetColors, ' - ', ...args)
}

const logSuccess = (...args) => {
	_log('SUCCESS', '\x1b[42m', '\x1b[37m', args)
}

const logInfo = (...args) => {
	_log('INFO', '\x1b[46m', '\x1b[37m', args)
}

const logWarning = (...args) => {
	_log('WARNING', '\x1b[43m', '\x1b[30m', args)
}

const logError = (...args) => {
	_log('ERROR', '\x1b[41m', '\x1b[37m', args)
}

const logger = {
	logSuccess,
	logInfo,
	logWarning,
	logError,
}

module.exports = logger
