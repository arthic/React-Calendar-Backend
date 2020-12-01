const {response} = require('express')
// Models
const Usuario = require('../models/Usuario')
// Encriptar constraseñas | npm i bcryptjs
const bcrypt = require('bcryptjs')
// JWT
const {generarJWT} = require('../helpers/jwt')

// Response nos da intellicense
const crearUsuario = async (req, res = response) => {
	const {email, password} = req.body

	try {
		let usuario = await Usuario.findOne({email})
		// Validar si existe el usuario, si no existe, moongose retorna "null"
		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Un usuario existe con ese correo'
			})
		}
		// Si no existe, se guarda en la base de datos
		usuario = new Usuario(req.body)
		// Encriptar contraseña
		const salt = bcrypt.genSaltSync()
		// (password) del req.body
		usuario.password = bcrypt.hashSync(password, salt)

		await usuario.save()

		// Generar nuesto JWT
		const token = await generarJWT(usuario.id, usuario.name)

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token
		})
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el administrador'
		})
	}

}

const loginUsuario = async(req, res = response) => {
	const {email, password} = req.body

	try {
		const usuario = await Usuario.findOne({email})
		// Validar si existe el usuario no existe
		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'El usuario no existe con ese email'
			})
		}

		// Confirmar los passwords
		// compara (password) del req.body con el de la db
		const validPassword = bcrypt.compareSync(password, usuario.password)
		// Si no es válido
		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Password incorrecto'
			})
		}
		// Generar nuesto JWT
		const token = await generarJWT(usuario.id, usuario.name)

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token
		})
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el administrador'
		})
	}
}

const revalidarToken = async(req, res = response) => {
	const {uid, name} = req

	// Generar nuevo JWT
	const token = await generarJWT(uid, name)
	res.json({
		ok: true,
		uid,
		name,
		token
	})
}

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidarToken
}