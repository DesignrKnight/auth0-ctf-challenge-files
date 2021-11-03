const express        = require('express');
const router         = express.Router();
const JWTHelper      = require('../helpers/JWTHelper');
const AuthMiddleware = require('../middleware/AuthMiddleware');


let db;

const response = data => ({ message: data });

router.get('/', (req, res) => {
	return res.render('login.html');
});

router.get('/register', (req, res) => {
	return res.render('register.html');
});

router.post('/api/register', async (req, res) => {

	const { username, password, email } = req.body;

	if (username && password && email) {
		return db.checkUser(username)
			.then(user => {
				if (user) return res.status(401).send(response('User already registered!'));
				db.getLastUserUid()
					.then(user_uid => {
						return db.registerUser(username, password, email, user_uid.user_uid + 1)
							.then(() => res.send(response('User registered successfully!')))
					})
			})
			.catch(() => res.send(response('Something went wrong!')));
	}
	return res.status(401).send(response('Please fill out all the required fields!'));
});

router.post('/api/login', async (req, res) => {

	const { username, password } = req.body;

	if (username && password) {
		return db.loginUser(username, password)
			.then(user => {
				let token = JWTHelper.sign({ username: user.username });
				res.cookie('session', token, { maxAge: 3600000 });
				res.send(response('User authenticated successfully!'));
			})
			.catch(() => res.status(403).send(response('Invalid username or password!')));
	}
	return res.status(500).send(response('Missing parameters!'));
});

router.get('/dashboard', AuthMiddleware, async (req, res, next) => {

	return db.getUser(req.data.username)
		.then(user => {
			if (user === undefined) return res.redirect('/');
			res.render('dashboard.html', {user});
		})
		.catch(() => res.status(500).send(response('Something went wrong!')));
});

router.get('/api/transactions/:user_uid', AuthMiddleware, async (req, res) => {

	return db.getUser(req.data.username)
		.then(user => {
			if (user === undefined) return res.redirect('/'); 
			if (req.params.user_uid) {
				return db.getSavedTransactions(req.params.user_uid)
					.then(transactions  => {
						if (transactions) return res.send({transactions});
						res.status(404).send(response('user does not exist'));
				})	
			}
			return res.status(403).send(response('Missing parameters!'));
		})
		.catch(() => res.status(500).send(response('Something went wrong!')));
});

router.post('/api/transactions/add', AuthMiddleware, async (req, res) => {

	return db.getUser(req.data.username)
		.then(user => {
			if (user === undefined) return res.redirect('/'); 
			const { recType, recDesc, recAmount } = req.body;
			if (recType && recDesc && recAmount) {
				return db.addTransaction(user.user_uid, recType, recDesc, recAmount)
					.then(()  => res.send(response('Transaction added successfully!')))	
			}
			return res.status(403).send(response('Missing parameters!'));
		})
		.catch(() => res.status(500).send(response('Something went wrong!')));
});

router.post('/api/transactions/delete', AuthMiddleware, async (req, res) => {

	return db.getUser(req.data.username)
		.then(user => {
			if (user === undefined) return res.redirect('/'); 
			const { transId } = req.body;
			if (transId) {
				return db.delTransaction(user.user_uid, transId)
					.then(()  => res.send(response('Transaction deleted successfully!')))	
			}
			return res.status(403).send(response('Missing parameters!'));
		})
		.catch(() => res.status(500).send(response('Something went wrong!')));
});

router.get('/logout', (req, res) => {
	res.clearCookie('session');
	return res.redirect('/');
});

module.exports = database => { 
	db = database;
	return router;
};