process.env.NODE_ENV !== 'production' && require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const session = require('express-session');
const cors = require('cors');
const methodOveride = require('method-override');
const port = process.env.PORT || 3000;
const redis_port = process.env.PORT || 6379;

//require routes
const indexRoute = require('./routes/index');
const userRoute = require('./routes/api');
const searchRoute = require('./routes/search');
// redis config
let Redis_store = require('connect-redis')(session);
let client = redis.createClient(redis_port);

//check if err
client.on('error', (err) => {
	console.log('redis client error: ' + err);
});

// connect to the database
mongoose.connect('mongodb://localhost:27017/mock101', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
// error messages from db
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDb connection error'));

// initialize express server
const server = express();

// set view engine
server.set('view engine', 'ejs');
//static files
server.use(express.static(__dirname + '/public'));
// config method-override
server.use(methodOveride('_method'));

// cors allow all requests
server.use(cors());
server.use('*', cors());

// express body-parser
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Configure Sessions
server.use(
	session({
		store: new Redis_store({ client, ttl: 86400 }),
		cookie: { secure: false },
		secret: process.env.SECRETSESS,
		resave: false,
		saveUninitialized: false
	})
);
// express middleware
server.use(function(req, res, next) {
	next();
});

//  configure routes
server.use('/', indexRoute);
server.use('/api', userRoute);
server.use(searchRoute);

server.listen(port, (err) => {
	if (err) throw err;
	console.log('> now running on port 3000');
});

module.exports = server;
