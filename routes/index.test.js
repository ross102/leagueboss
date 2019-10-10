process.env.NODE_ENV !== 'production' && require('dotenv').config();

const request = require('supertest');
const { server, mongoose, cors, client, Redis_store } = require('../utils');

// afterAll(() => {
// 	client.quit();
// });

// connect to the database
mongoose.connect('mongodb://localhost:27017/mock101', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
// error messages from db
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDb connection error'));

test('user sign up route is working', (done) => {
	request(server)
		.post('/register')
		.send({
			name: 'kamsi',
			email: 'kamsi@gmail.com',
			password: 'kamsi'
		})
		.expect(200, done);
});

test('login route is working', (done) => {
	request(server)
		.post('/login')
		.send({
			email: 'kamsi@gmail.com',
			password: 'kamsi'
		})
		.expect(200, done);
});

//before running this test again remba to add token
// test('unique link route is working', (done) => {
// 	request(server).get('/fixtures/blabla').expect(200, done);
// });

test('search teams route is working', (done) => {
	request(server).get('/teams/search').query({ search: 'manu' }).expect(200, done);
});
//before testing this route ensure you're an admin
// test('api admin create team route is working', (done) => {
// 	request(server).post('/api/team/new').send({ name: 'everton' }).expect(200, done);
// });
//before testing this route ensure you're an admin nd u hv id
// test('api admin remove team route is working', (done) => {
// 	request(server).post('/api/team/remove/:id').expect(200, done);
// });
//before testing this route ensure you're an admin nd u hv id
// test('api admin edit team route is working', (done) => {
// 	request(server).post('/api/team/edit/:id').expect(200, done);
// });
//before testing this route ensure you're an admin
// test('api admin view team route is working', (done) => {
// 	request(server).post('/api/teams').expect(200, done);
// });

//before testing this route ensure you're an admin
// test('api admin create fixture route is working', (done) => {
// 	request(server).post('/api/fixtures/new').expect(200, done);
// });

//before testing this route ensure you're an admin
// test('api admin remove fixture route is working', (done) => {
// 	request(server).post('/api/remove/:id').expect(200, done);
// });

//before testing this route ensure you're an admin
// test('api admin edit fixture route is working', (done) => {
// 	request(server).post('/api/edit/:id').expect(200, done);
// });

//before testing this route ensure you're an admin
// test('api admin view fixture route is working', (done) => {
// 	request(server).post('/api/fixtures/').expect(200, done);
// });
