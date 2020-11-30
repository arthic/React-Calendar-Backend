const {response} = require('express')
const jwt = require('jsonwebtoken')

const validarJWT = (req, res = response, next) => {
	// x-token headers
	const token = req.header('x-token')

	// Si tengo null en el token | osea el token no es valido
	if (!token) {
		return res.status(401).json({
			ok: false,
			msg: 'No hay token en la petición'
		})
	}

	try {
		// payload: La info que trae el JWT, esta desestructurado
		const {uid, name} = jwt.verify(
			token,
			process.env.SECRET_JWT_SEED
		)
		req.uid = uid
		req.name = name

	} catch (error) {
		return res.status(401).json({
			ok: false,
			msg: 'Token no válido'
		})
	}

	next()
}
module.exports = {
	validarJWT
}