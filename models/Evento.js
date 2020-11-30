const {Schema, model} = require('mongoose')
// mongoose.connect(process.env.DB_CNN, { useFindAndModify: false });
// Como lusca el usuario en la db
const EventoSchema = Schema({
	title: {
		type: String,
		required: true
	},
	notes: {
		type: String,
	},
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date,
		required: true
	},
	user: {
		// Le dice a mongoose que será una refencia, en esta caso a 'Usuario
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: true
	}
})

// Cambiar como se serializan los datos
EventoSchema.method('toJSON', function() {
	// Referencia a todo el objete que se esta serializando
	const {__v, _id, ...object} = this.toObject()
	object.id = _id
	return object
})
module.exports = model('Evento', EventoSchema)
