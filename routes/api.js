const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Team = require('../models/Team');
const Fixture = require('../models/Fixtures');
const { isloggedIn, isAdmin } = require('../middleware');

//===== admin can create, remove, edit, view teams=========
//create team
router.post('/team/new', isAdmin, (req, res) => {
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
// remove team
router.post('/team/remove/:id', isAdmin, (req, res) => {
	Team.findByIdAndRemove(req.params.id, (err) => {
		if (err) throw err;
	});
	res.status(200).json({ msg: 'deleted' });
});
// edit team
router.post('/team/edit/:id', isAdmin, (req, res) => {
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
// view team
router.get('/teams', isloggedIn, (req, res) => {
	Team.find({}).then((allTeams) => {
		res.status(200).json({
			allTeams
		});
	});
});

//========admin can create, remove, edit and view fixtures=======
// create fixtures
router.post('/fixtures/new', isAdmin, async (req, res) => {
	// only create fixtures for teams that exist in the database
	const teamA = await Team.findOne({ name: req.body.first_team });
	if (!teamA) {
		return res.status(401).json({ msg: 'Pls input a team that exists in league' });
	}
	const teamB = await Team.findOne({ name: req.body.second_team });
	if (!teamB) {
		return res.status(401).json({ msg: 'Pls input a team that exists in league ' });
	}
	let created_match = new Fixture({
		fixtures: {
			first_team: req.body.first_team,
			second_team: req.body.second_team
		},
		play_date: req.body.play_date,
		play_time: req.body.play_time
	});
	created_match.save((err) => {
		if (err) throw err;
	});
	return res.json({
		success: true,
		fixture: 'fixture created'
	});
});
// remove fixtures
router.post('/fixtures/remove/:id', isAdmin, (req, res) => {
	Fixture.findByIdAndRemove(req.params.id, (err) => {
		if (err) throw err;
	});
	return res.status(200).json({ msg: 'deleted' });
});
// edit fixtures
router.post('/fixtures/edit/:id', isAdmin, async (req, res) => {
	let match = await Fixture.findById(req.params.id);
	match.fixtures.first_team = req.body.first_team;
	match.fixtures.second_team = req.body.second_team;
	match.fixtures.play_date = req.body.play_date;
	match.fixtures.play_time = req.body.play_time;
	match.save((err) => {
		if (err) throw err;
	});
	return res.json({
		msg: 'updated',
		match
	});
});
// view pending fixtures
router.get('/fixtures', async (req, res) => {
	let allfixtures = await Fixture.find({});
	return res.status(200).json({
		allfixtures
	});
});

// generate unique links for fixtures
router.get('/fixtures/:id', async (req, res) => {
	let fixture = await Fixture.findById(req.params.id);
	return res.status(200).json({
		fixture: fixture
	});
});

module.exports = router;
