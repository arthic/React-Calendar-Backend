/*
	Rutas de Usuarios / Auth
	host + /api/auth
*/
const {Router} = require('express')
const {check} = require('express-validator')
const {validarCampos} = require('../middlewares/validar-campos')
// Controllers
const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth')
// Validar JWT
const {validarJWT} = require('../middlewares/validar-jwt')
// npm i express-validator
const router = Router()


// Rutas
router.post(
	'/new',
	[ //middlewares - array más de un middleware
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').isEmail(),
		check('password', 'El password debe tener como mínimo 6 caracteres').isLength({min: 6}),
		validarCampos
	],
	crearUsuario
)
router.post(
	'/',
	[ //middlewares
		// Aunque no se compla el check, pasa por eso es importante el "validarCampos"
		check('email', 'El email es obligatorio').isEmail(),
		check('password', 'El password debe tener como mínimo 6 caracteres').isLength({min: 6}),
		validarCampos
	],
	loginUsuario
)
// Sin array porque solo es 1 middleware
router.get('/renew', validarJWT, revalidarToken)

module.exports = router