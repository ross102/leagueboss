const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Team = require('../models/Team');
const Fixture = require('../models/Fixtures');
const { isloggedIn, isAdmin } = require('../middleware');

// unique link that serves scores of completed fixtures
router.get('/fixtures/:completed', (req, res) => {
	Fixture.find({}, (err, matches) => {
		if (err) throw err;
		let first_score = Math.floor(Math.random() * Math.floor(5));
		let second_score = Math.floor(Math.random() * Math.floor(5));
		matches.map((match) => {
			match.is_completed = true;
			match.completed_result.first_team_score = first_score;
			match.completed_result.second_team_score = second_score;
		});
		res.json({ matches });
	});
});

// fuzzy search for teams
router.get('/api/teams/search', (req, res) => {
	if (req.search.query) {
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

router.get('/api/teams/fixtures', (req, res) => {
	if (req.search.query) {
		let search = req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		search = new RegExp(search, 'gi');
		Fixture.find({
			'fixtures.first_team': search,
			$or: {
				'fixtures.second_team': search
			}
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

module.exports = router;
