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
            DROP TABLE IF EXISTS tickets;

            CREATE TABLE IF NOT EXISTS tickets (
                id         INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
                name       VARCHAR(255) NOT NULL,
                email      VARCHAR(255) NOT NULL,
                website    VARCHAR(255) NOT NULL,
                message    VARCHAR(255) NOT NULL
            );
        `);
	}


	async addTicket(name, email, website, message) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('INSERT INTO tickets (name, email, website, message) VALUES (? , ?, ?, ?)');
				resolve(await stmt.run(name, email, website, message));
			} catch(e) {
				reject(e);
			}
		});
	}

	async getTickets() {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT * FROM tickets');
				resolve(await stmt.all());
			} catch(e) {
				reject(e);
			}
		});
	}
}

module.exports = Database;