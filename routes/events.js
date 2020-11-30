// Event routers | /api/events
const { Router } = require('express');
const router = Router()
// Validar campos
const {check} = require('express-validator')
const {validarCampos} = require('../middlewares/validar-campos')
const {isDate} = require('../helpers/isDate')
// JWT
const {validarJWT} = require('../middlewares/validar-jwt')
// Controllers
const {
	getEventos,
	crearEvento,
	actualizarEvento,
	eliminarEvento,
} = require('../controllers/events')

// Todas tienen que pasar por la validacion del JWT
/* Cualquier peticion que se encuentre debajo de router,
tendra su JWT, si se requiere de eventos que no pasen por
el JWT, unicamente debe estar declarado arriba de dicha func*/
router.use(validarJWT)

// Obtener eventos
router.get('/', getEventos)

// Crear nuevo evento
router.post(
	'/',
	[
		// Aunque no se compla el check, pasa por eso es importante el "validarCampos"
		check('title', 'El titulo es obligatorio').not().isEmpty(),
		/* validator no tiene un validador de fechas, pero permite implementar
		a traves de un custom callback/funcion*/
		check('start', 'Fecha de inicio es obligatoria').custom(isDate),
		check('end', 'Fecha de finalización es obligatoria').custom(isDate),
		validarCampos
	],
	crearEvento
)

// Actualizar evento
router.put(
	'/:id',
	[
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ],
	actualizarEvento
)

// Borrar evento
router.delete('/:id', eliminarEvento)

module.exports = router