const bot = require('../bot');
const express = require('express');
const router = express.Router();

let db;

const response = (data) => ({ message: data });

router.get('/', (req, res) => {
	return res.render('index.html');
});

router.get('/services', (req, res) => {
	return res.render('services.html');
});

router.get('/pricing', (req, res) => {
	return res.render('pricing.html');
});

router.get('/support', (req, res) => {
	return res.render('support.html');
});

router.get('/settings', (req, res) => {
	console.log(req.socket.remoteAddress);
	console.log(req.headers);
	// if (req.ip != '127.0.0.1') return res.redirect('/');
	return res.render('settings.html');
});

router.get('/tickets', async (req, res, next) => {
	return db
		.getTickets()
		.then((allTickets) => {
			res.render('ticket.html', { allTickets });
		})
		.catch(() => res.status(500).send(response('Something went wrong!')));
});

router.post('/api/submit_ticket', async (req, res) => {
	const { name, email, website, message } = req.body;
	if (name && email && website && message) {
		return db.addTicket(name, email, website, message).then(() => {
			// bot.purgeData(db);
			res.send(response('Ticket submitted successfully! An admin will review the ticket shortly!'));
		});
	}
	return res.status(403).send(response('Please fill out all the fields first!'));
});

module.exports = (database) => {
	db = database;
	return router;
};
