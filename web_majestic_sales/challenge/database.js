const sqlite = require('sqlite-async');

class Database {
	constructor(db_file) {
		this.db_file = db_file;
		this.db = undefined;
	}
	
	async connect() {
		this.db = await sqlite.open(this.db_file);
	}

	async migrate() {
		return this.db.exec(`
            DROP TABLE IF EXISTS users;

            CREATE TABLE IF NOT EXISTS users (
                id         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                username   VARCHAR(255) NOT NULL UNIQUE,
                password   VARCHAR(255) NOT NULL
            );

            INSERT INTO users (username, password) VALUES ('admin', 'REDACTED_SECRET_0');

            DROP TABLE IF EXISTS app_config;

            CREATE TABLE IF NOT EXISTS app_config (
                id       INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                kid      VARCHAR UNIQUE NOT NULL,
                tenant   VARCHAR(255) NOT NULL,
                secret   VARCHAR(255) NOT NULL
            );

            INSERT INTO app_config (kid,tenant,secret) VALUES ('1','gr_office','REDACTED_SECRET_1');
            INSERT INTO app_config (kid,tenant,secret) VALUES ('2','uk_office','REDACTED_SECRET_2');
         `);
	}

	async getAppKey(kid) {
		// TODO: add parametrization
		return new Promise(async (resolve, reject) => {
			try {
				let query = `SELECT * FROM app_config WHERE kid = '${kid}';`;
				resolve(await this.db.get(query));
			} catch(e) {
				reject(e);
			}
		});
	}

	async getKid(tenant) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT kid FROM app_config WHERE tenant = ?');
				resolve(await stmt.get(tenant));
			} catch(e) {
				reject(e);
			}
		});
	}

	async registerUser(user, pass) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('INSERT INTO users (username, password) VALUES ( ?, ?)');
				resolve((await stmt.run(user, pass)));
			} catch(e) {
				reject(e);
			}
		});
	}

	async loginUser(user, pass) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT username FROM users WHERE username = ? and password = ?');
				resolve(await stmt.get(user, pass));
			} catch(e) {
				reject(e);
			}
		});
	}

	async getUser(user) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT * FROM users WHERE username = ?');
				resolve(await stmt.get(user));
			} catch(e) {
				reject(e);
			}
		});
	}

	async checkUser(user) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT username FROM users WHERE username = ?');
				let row = await stmt.get(user);
				resolve(row !== undefined);
			} catch(e) {
				reject(e);
			}
		});
	}

}

module.exports = Database;