const {response} = require('express')
const Evento = require('../models/Evento')

const getEventos = async(req, res = response) => {

	// Podemos especificar condiciones pero en este caso queremos traer todos
	const eventos = await Evento.find()
	// Rellenar los datos del usuario en la "res"
	.populate('user', 'name')

	res.json({
		ok: true,
		eventos
	})
}

const crearEvento = async(req, res = response) => {

	// Grabar en la BD
	const evento = new Evento(req.body)

	try {
		// Validación de que requiere usuario, viene del EventoSchema
		evento.user = req.uid
		const eventoGuardado = await evento.save()

		res.json({
			ok: true,
			evento: eventoGuardado
		})

	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador...'
		})
	}
}

const actualizarEvento = async(req, res = response) => {

	// Obtener id del evento
	const eventoId = req.params.id
	const {uid} = req

	try {
		// Validar si existe en la BD
		const evento = await Evento.findById(eventoId)
		/*El formato del id des de 12 bytes, si es de menor mayor longitud
		lo bota directo al catch*/
		// Si no existe el evento
		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: 'Evento no existe por ese id'
			})
		}

		// Validar que la persona que creo el evento sea la misma que va actualizar
		if (evento.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'No cuenta con privilegios para editar este evento'
			})
		}

		// Si llega a este punto, quiere decir que puede editar
		const nuevoEvento = {
			...req.body,
			// En la petición no viene el uid, por eso se coloca
			user: uid
		}
		// Actualización en la BD
		// Si requiere retornar los nuevos valores, agregar el 3° argumento
		const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})

		res.json({
			ok: true,
			evento: eventoActualizado
		})

	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador...'
		})
	}
}

const eliminarEvento = async(req, res = response) => {
	// Obtener id del evento
	const eventoId = req.params.id
	const {uid} = req

	try {
		// Validar si existe en la BD
		const evento = await Evento.findById(eventoId)
		// Si no existe el evento
		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: 'Evento no existe por ese id'
			})
		}

		// Validar que la persona que creo el evento sea la misma que va eliminar
		if (evento.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'No cuenta con privilegios para eliminar este evento'
			})
		}

		// Si llega a este punto, quiere decir que puede eliminar
		await Evento.findByIdAndDelete(eventoId)

		res.json({ok: true})

	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador...'
		})
	}
}

module.exports = {
	getEventos,
	crearEvento,
	actualizarEvento,
	eliminarEvento,
}