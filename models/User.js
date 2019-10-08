const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	email: String,
	password: String,
	isAdmin: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userSchema);
