const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Team = require('../models/Team');
const { isloggedIn, isAdmin } = require('../middleware');

router.post('/admin/new', (req, res) => {
	// make sure the team created contains only alphabets
	if (req.body.name.length < 5 || !req.body.name.match(/^[a-zA-Z ]+$/)) {
		return res.status(401).json({
			msg: 'team name should be more than four letters'
		});
	}
	// avoid duplicate teams
	Team.findOne({ name: req.body.name })
		.then((foundTeam) => {
			if (foundTeam) {
				return res.status(401).json({
					success: 'false',
					msg: 'Team already exists'
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				success: 'false',
				msg: error
			});
		});
	// create team
	const newTeam = new Team({
		name: req.body.name
	});
	newTeam.save((err) => {
		if (err) throw err;
	});
	res.json({
		success: true,
		newTeam
	});
});

router.post('/admin/remove/:id', (req, res) => {
	Team.findByIdAndRemove(req.params.id, (err) => {
		if (err) throw err;
	});
	res.status(200).json({ msg: 'deleted' });
});

router.post('/admin/edit/:id', (req, res) => {
	// make sure the team updated contains only alphabets
	if (req.body.name.length < 5 || !req.body.name.match(/^[a-zA-Z ]+$/)) {
		return res.status(401).json({
			msg: 'team name should be more than four letters'
		});
	}
	Team.findById(req.params.id)
		.then((edit) => {
			edit.name = req.body.name;
			edit.save((err) => {
				if (err) throw err;
			});
			res.json({
				success: true,
				update: edit
			});
		})
		.catch((err) => res.status(500).json({ msg: err }));
});

router.get('/admin/teams', (req, res) => {
	Team.find({}).then((allTeams) => {
		res.status(200).json({
			allTeams
		});
	});
});

module.exports = router;
