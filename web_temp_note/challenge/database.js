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
            DROP TABLE IF EXISTS notes;

            CREATE TABLE IF NOT EXISTS notes (
                id         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                username   VARCHAR(255) NOT NULL,
                note_title   VARCHAR(255) NOT NULL,
                note_content VARCHAR(255)NOT NULL
            );

            INSERT INTO notes (username, note_title, note_content) VALUES ('admin', 'Flag', 'HTB{f4k3_fl4g_f0r_t3st1ng}');

         `);
	}

	async delAcc(username) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('DELETE FROM notes WHERE username = ?');
				resolve((await stmt.run(username)));
			} catch(e) {
				reject(e);
			}
		});
	}

	async delNote(id, username) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('DELETE FROM notes WHERE id = ? AND username = ?');
				resolve((await stmt.run(id, username)));
			} catch(e) {
				reject(e);
			}
		});
	}

	async addNote(title, content, username) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('INSERT INTO notes (username, note_title, note_content) VALUES ( ?, ?, ?)');
				resolve(await stmt.run(username, title, content));
			} catch(e) {
				reject(e);
			}
		});
	}

	async getNotes(user) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT * FROM notes WHERE username = ?');
				resolve(await stmt.all(user));
			} catch(e) {
				reject(e);
			}
		});
	}

	   async getLastNoteID() {
        return new Promise(async (resolve, reject) => {
            try {
                let stmt = await this.db.prepare('SELECT id from notes ORDER BY rowid DESC LIMIT 1;');
                resolve(await stmt.get());
            } catch(e) {
                reject(e);
            }
        });
    }

}

module.exports = Database;