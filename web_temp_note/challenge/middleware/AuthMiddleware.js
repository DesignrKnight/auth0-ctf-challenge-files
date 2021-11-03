const JWTHelper = require('../helpers/JWTHelper');
const crypto    = require('crypto');

module.exports = async (req, res, next) => {
	try{
		if (req.cookies.session === undefined) {
			let username = `guest_${crypto.randomBytes(5).toString('hex')}`;
			let token = await JWTHelper.sign({
				username
			});
			res.cookie('session', token, { maxAge: 259200000 });
			req.data = {
				username: username
			};
			return next();
		}
		let { username } = await JWTHelper.verify(req.cookies.session);
		req.data = {
			username: username
		};
		next();
	} catch(e) {
		console.log(e);
		return res.status(500).send('Internal server error');
	}
}