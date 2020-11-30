// npm i moment
const moment = require('moment')

const isDate = (value) => {
	// Si no existe
	if (!value) {
		return false
	}

	const fecha = moment(value)
	// Si es valida
	if (fecha.isValid()) {
		return true
	} else {
		return false
	}
}

module.exports = {isDate}