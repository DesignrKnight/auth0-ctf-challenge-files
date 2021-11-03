const JWTHelper = require('../helpers/JWTHelper');

const response = data => ({ message: data });

module.exports = async (req, res, next) => {
	let db = req.db;
	try {
		if (req.cookies.session === undefined) {
			if (!req.is('application/json')) return res.redirect('/');
			return res.status(401).send(response('Authentication required!'));
		}
		return JWTHelper.getKid(req.cookies.session)
			.then(kid => {
				if (kid === undefined) return res.status(500).send(response('kid is missing or doesn\'t exist!'));
				db.getAppKey(kid)
					.then(appKey => {
						if (appKey === undefined) return res.status(500).send(response('No such kid!'));
						JWTHelper.verify(req.cookies.session, appKey.secret)
							.then(data => {
								req.data = {
									username: data.username,
									tenant: data.tenant
								}
								next();
							})
							.catch(err => res.status(500).send(response(err.toString())));
					})
					.catch(err => res.status(500).send(err));
			})
			.catch(err => res.status(500).send(response("Something went wrong!")));
	} catch (e) {
		return res.status(500).send(response(e.toString()));
	}
}