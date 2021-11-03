const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const JWTHelper = require('../helpers/JWTHelper');
const AuthMiddleware = require('../middleware/AuthMiddleware');

let db;

const response = (data) => ({ message: data });

router.get('/', AuthMiddleware, async (req, res) => {
	return res.render('index.html', { username: req.data.username });
});

router.get('/api/delete', AuthMiddleware, async (req, res) => {
	if (req.data.username !== 'admin') {
		return db.delAcc(req.data.username).then(() => res.send(response('Account deleted successfully!')));
	}
	return res.send(response('Admin account cannot be deleted!'));
});

router.get('/api/notes', AuthMiddleware, async (req, res) => {
	return db
		.getNotes(req.data.username)
		.then((notes) => {
			res.json(notes);
		})
		.catch(() => res.status(500).send(response('Something went wrong!')));
});

router.post('/api/notes/add', AuthMiddleware, async (req, res) => {
	const { note_title, note_content } = req.body;

	if (note_title && note_content) {
		return db
			.addNote(note_title, note_content, req.data.username)
			.then(() => {
				db.getLastNoteID()
					.then((lastId) => {
						res.json({ message: 'Note added successfully!', id: lastId.id });
					})
					.catch(() => res.status(500).send(response('Something went wrong!')));
			})
			.catch(() => res.status(500).send(response('Something went wrong!')));
	}
	return res.status(403).send(response('Missing parameters!'));
});

router.post('/api/notes/delete', AuthMiddleware, async (req, res) => {
	const { noteId } = req.body;
	if (noteId) {
		return db.delNote(noteId, req.data.username).then(() => res.send(response('Note deleted successfully!')));
	}
	return res.status(403).send(response('Missing parameters!'));
});

router.get('/logout', (req, res) => {
	res.clearCookie('session');
	return res.redirect('/');
});

module.exports = (database) => {
	db = database;
	return router;
};
