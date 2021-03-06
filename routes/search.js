const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Team = require('../models/Team');
const Fixture = require('../models/Fixtures');
const { isloggedIn, isAdmin } = require('../middleware');

// unique link that serves scores of completed fixtures
router.get('/fixtures/:completed', isloggedIn, (req, res) => {
	Fixture.find({}, (err, matches) => {
		if (err) throw err;
		matches.map((match) => {
			let first_score = Math.floor(Math.random() * Math.floor(5));
			let second_score = Math.floor(Math.random() * Math.floor(5));
			match.is_completed = true;
			match.completed_result.first_team_score = first_score;
			match.completed_result.second_team_score = second_score;
		});
		res.json({ matches });
	});
});

// fuzzy search for teams for the public
router.get('/teams/search', (req, res) => {
	if (req.query.search) {
		let search = req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		search = new RegExp(search, 'gi');
		Team.find({ name: search })
			.then((found) => {
				if (found.length > 0) {
					return res.json({ found });
				}
				return res.json({ msg: 'search not found' });
			})
			.catch((err) => {
				res.status(500).json({ err });
			});
	}
});
// fuzzy search for fixtures for the public
router.get('/teams/fixtures', (req, res) => {
	if (req.query.search) {
		let search = req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		search = new RegExp(search, 'gi');
		Fixture.find({
			$or: [
				{
					'fixtures.second_team': search
				},
				{
					'fixtures.first_team': search
				}
			]
		})
			.then((found) => {
				if (found.length > 0) {
					return res.json({ found });
				}
				return res.json({ msg: 'search not found' });
			})
			.catch((err) => {
				res.status(500).json({ err });
			});
	}
});

// END (-.-)

module.exports = router;
