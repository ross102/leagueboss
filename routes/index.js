const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
	res.render('index');
});
//sign up for user and admin
router.post('/register', (req, res) => {
	// some validations
	if (req.body.name.length < 3) {
		return res.status(401).json({
			success: 'false',
			msg: 'invalid username format'
		});
	}
	if (req.body.password.length < 5) {
		return res.status(401).json({
			success: 'false',
			msg: 'password should be more than four characters'
		});
	}
	// Check if email already exists in db
	User.findOne({ email: req.body.email })
		.then((foundEmail) => {
			if (foundEmail) {
				return res.status(401).json({
					success: 'false',
					msg: 'email already exists'
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				success: 'false',
				msg: error
			});
		});
	//check if name already exists
	User.findOne({ name: req.body.name })
		.then((foundUser) => {
			if (foundUser) {
				return res.status(401).json({
					success: 'false',
					msg: 'That username already exists'
				});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				success: 'false',
				msg: error
			});
		});

	//register user
	const newUser = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});
	//=====> SET ADMIN USER
	if (req.body.isAdmin === process.env.ISADMIN) {
		newUser.isAdmin = true;
	} else {
		newUser.isAdmin = false;
	}
	// hash password
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) console.log(err);
			newUser.password = hash;
			newUser
				.save()
				.then((user) => {
					res.json({
						success: 'true',
						user: user
					});
				})
				.catch((err) => {
					return res.status(500).json({
						success: 'false',
						msg: err
					});
				});
		});
	});
});
// user and admin login
router.post('/login', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ err: 'please input correct details' });
	}
	User.findOne({ email })
		.then((user) => {
			if (!user) {
				return res.status(400).json({ err: 'email not found' });
			}
			bcrypt.compare(password, user.password).then((isMatch) => {
				if (isMatch) {
					//create session with redis
					req.session.email = req.body.email;
					req.session.name = req.body.username;
					req.session.isAdmin = user.isAdmin;
					// create Jwt payload
					const payload = {
						id: user.id,
						username: user.name
					};
					// sign token
					jwt.sign(
						payload,
						process.env.SECRETORKEY,
						{
							expiresIn: 31556926
						},
						(err, token) => {
							if (err) throw err;
							return res.json({
								success: true,
								token: 'Bearer ' + token
							});
						}
					);
				} else {
					return res.status(401).json({
						success: 'false',
						err: 'password incorrect'
					});
				}
			});
		})
		.catch((err) => {
			return res.status(500).json({
				success: 'false',
				msg: err
			});
		});
});

module.exports = router;
