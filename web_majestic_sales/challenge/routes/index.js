const express        = require('express');
const router         = express.Router();
const fs             = require('fs');
const JWTHelper      = require('../helpers/JWTHelper');
const AuthMiddleware = require('../middleware/AuthMiddleware');

let db;

router.use(function (req, res, next) {
	req.db = db;
	next()
})

const response = data => ({ message: data });

router.get('/', (req, res) => {
	return res.render('login.html');
});

router.get('/register', (req, res) => {
	return res.render('register.html');
});

router.post('/api/register', async (req, res) => {

	const { username, password } = req.body;

	if (username && password) {
		return db.checkUser(username)
			.then(user => {
				if (user) return res.status(401).send(response('User already registered!'));
				return db.registerUser(username, password)
					.then(() => res.send(response('User registered successfully!')))
			})
			.catch(() => res.send(response('Something went wrong!')));
	}
	return res.status(401).send(response('Please fill out all the required fields!'));
});

router.post('/api/login', async (req, res) => {

	const { username, password, tenant} = req.body;

	if (username && password && tenant) {
		if (!tenant.match(/^[a-z0-9_]+$/i)) return res.status(403).send(response('Malformed tenant ID!'));

		return db.getKid(tenant)
			.then(appKid => {
				if (appKid === undefined) return res.status(403).send(response('Tenant does not exist!'));
				db.getAppKey(appKid.kid)
					.then(appKey => {
						db.loginUser(username, password)
							.then(user => {
								let token = JWTHelper.sign(
									{ username: user.username, tenant: appKey.tenant }, 
									appKey.secret, 
									appKey.kid
								);
								res.cookie('session', token, { maxAge: 3600000 });
								res.send(response('User authenticated successfully!'));
							})
							.catch(() => res.status(403).send(response('Invalid username or password!')));
					})
					.catch(() => res.status(403).send(response('Something went wrong!')));
			}) 
	}
	return res.status(500).send(response('Missing parameters!'));
});

router.get('/dashboard', AuthMiddleware, async (req, res, next) => {
	let user = req.data;
	let flag = null;
	if (user === undefined) return res.redirect('/');
	if (user.username == "admin") flag = fs.readFileSync('/flag', 'utf8');
	if (user.tenant == "gr_office") {
		return res.render("DashboardGr.html", {user, flag});
	}
	return res.render('dashboard.html', {user, flag});
});

router.get('/logout', (req, res) => {
	res.clearCookie('session');
	return res.redirect('/');
});

module.exports = database => { 
	db = database;
	return router;
};