const User = require('../models/User');
const jwt = require('jsonwebtoken');

const middleware = {
	isloggedIn: (req, res, next) => {
		let token = req.headers['x-access-token'] || [ 'x-access-authorization' ];
		token = token.split(' '); //bearer token
		token = token[1];
		if (!token) {
			return res.status(400).json({
				success: 'false',
				msg: ' Access Denied. No token given. '
			});
		}
		jwt.verify(token, process.env.SECRETORKEY, (err, verified) => {
			if (err) throw new Error(err);
			req.session = verified;
			return next();
		});
	},
	isAdmin: (req, res, next) => {
		let token = req.headers['x-access-token'] || req.headers['x-access-authorization'];
		token = token.split(' '); //bearer token
		token = token[1];
		if (!token) {
			return res.status(400).json({
				success: 'false',
				msg: ' Access Denied. no token provided '
			});
		}
		jwt.verify(token, process.env.SECRETORKEY, (err, verified) => {
			if (err) throw err;
			req.session = verified;
			if (req.session.isAdmin) return next();
			return res.json({
				success: 'false',
				msg: 'No authorization given.'
			});
		});
	}
};

module.exports = middleware;
