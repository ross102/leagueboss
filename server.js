process.env.NODE_ENV !== 'production' && require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const methodOveride = require('method-override');
const port = process.env.PORT || 5000;

// connect to the database
mongoose.connect('mongodb://localhost:27017/mock101', {
	useNewUrlParser: true,
	useCreateIndex: true
});
// error messages from db
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDb connection error'));

// initialize express server
const server = express();

// set view engine
server.set('view engine', 'ejs');
//static files
app.use(express.static(__dirname + '/public'));
// config method-override
app.use(methodOveride('_method'));

// cors allow all requests
server.use(cors());
server.use('*', cors());

// express body-parser
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Configure Sessions
server.use(
	session({
		secret: 'lions are very nice',
		resave: false,
		saveUninitialized: false
	})
);
// express middleware
server.use(function(req, res, next) {
	next();
});

server.listen(port, (err) => {
	if (err) throw err;
	console.log('> now running on port 5000');
});

module.exports = server;
