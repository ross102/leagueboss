const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fixtureSchema = new Schema({
	fixtures: {
		first_team: String,
		second_team: String
	},
	play_date: Date,
	play_time: String,
	is_completed: {
		type: Boolean,
		default: false
	},
	completed_result: {
		first_team_score: {
			type: Number
		},
		second_team_score: {
			type: Number
		}
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Fixture', fixtureSchema);
