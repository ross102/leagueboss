const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isloggedIn, isAdmin } = require('../middleware');

router.get('/new', isloggedIn, (req, res) => {
	res.json({
		success: 'true'
	});
});

module.exports = router;
