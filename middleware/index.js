const User = require('../models/User');
const jwt = require('jsonwebtoken');

const middleware = {
	isloggedIn: (req, res, next) => {
		const auth = req.headers.authorization;
		if (auth) {
			let token = auth.split(' ')[1]; // Bearer token
			if (!token) {
				return res.status(400).json({
					success: 'false',
					msg: ' Access Denied.You have to log in. '
				});
			}
			jwt.verify(token, process.env.SECRETORKEY, (err, verified) => {
				if (err) throw new Error(err);
				return next();
			});
		}
	},
	isAdmin: (req, res, next) => {
		const auth = req.headers.authorization;
		if (auth) {
			let token = auth.split(' ')[1]; // Bearer token
			if (!token) {
				return res.status(400).json({
					success: 'false',
					msg: ' Access Denied. no token provided '
				});
			}
			jwt.verify(token, process.env.SECRETORKEY, (err, verified) => {
				if (err) throw err;
				if (req.session.isAdmin) return next();
				return res.json({
					success: 'false',
					msg: 'You are not authorised to access here.'
				});
			});
		}
	}
};

module.exports = middleware;
