const jwt = require('jsonwebtoken');

module.exports = {
	sign(data, secret, kid) {
		return jwt.sign(data, secret, {
			algorithm: 'HS256',
			header: { kid: kid }
		});
	},
	async verify(token, secret) {
		return new Promise(async (resolve, reject) => {
			try {
				return resolve(jwt.verify(token, secret, { algorithm: 'HS256' }));
			} catch (e) {
				reject(e);
			}
		});
	},
	async getKid(token) {
		return new Promise(async (resolve, reject) => {
			try {
				return resolve(jwt.decode(token, { complete: true }).header.kid);
			} catch (e) {
				reject(e);
			}
		});
	}
};