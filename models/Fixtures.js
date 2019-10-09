const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fixtureSchema = new Schema({
	first_team: {
		type: String
	},
	second_team: {
		type: String
	},
	play_date: String,
	play_time: String,
	is_completed: false,
	competition_result: String,
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Fixture', fixtureSchema);
