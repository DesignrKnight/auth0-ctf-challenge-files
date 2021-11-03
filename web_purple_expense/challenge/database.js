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
                password   VARCHAR(255) NOT NULL,
                email      VARCHAR(255) NOT NULL,
                user_uid       INTEGER NOT NULL
            );

            INSERT INTO users (username, password, email, user_uid) VALUES ('admin', '[REDACTED SECRET]', 'admin@purple-expense.htb', 73);
            INSERT INTO users (username, password, email, user_uid) VALUES ('louisbarnett', 'mcd0nalds#21', 'louis_p_barnett@mailinator.com', 131);
            INSERT INTO users (username, password, email, user_uid) VALUES ('ninaviola', '1katz&2dogz', 'ninaviola57331@mailinator.com', 132);
            INSERT INTO users (username, password, email, user_uid) VALUES ('alvinfisher', 'September#2019', 'alvinfisher1979@mailinator.com', 133);

            DROP TABLE IF EXISTS user_data;

            CREATE TABLE IF NOT EXISTS user_data (
                id         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                user_uid       INTEGER NOT NULL,
                type       VARCHAR(255) NOT NULL,
                description    VARCHAR(255) NOT NULL,
                amount   INTEGER NOT NULL
            );

            INSERT INTO user_data (user_uid,type,description,amount) VALUES (73,'Income','🚩 HTB{f4k3_fl4g_f0r_t3st1ng} 🚩',1337);
            INSERT INTO user_data (user_uid,type,description,amount) VALUES (131,'Expense','Dinner at Pizza place',47);
            INSERT INTO user_data (user_uid,type,description,amount) VALUES (131,'Expense','Sports Gear',35);
            INSERT INTO user_data (user_uid,type,description,amount) VALUES (131,'Income','Upwork',735);
            INSERT INTO user_data (user_uid,type,description,amount) VALUES (132,'Expense','Rent',995);
            INSERT INTO user_data (user_uid,type,description,amount) VALUES (132,'Income','Salary',2000);
            INSERT INTO user_data (user_uid,type,description,amount) VALUES (133,'Income','Salary',2400);
            INSERT INTO user_data (user_uid,type,description,amount) VALUES (133,'Expense','Gas/electric',107);
            INSERT INTO user_data (user_uid,type,description,amount) VALUES (133,'Expense','Birthday gift',37);
        `);
    }

    async getLastUserUid() {
        return new Promise(async (resolve, reject) => {
            try {
                let stmt = await this.db.prepare('SELECT user_uid from users ORDER BY rowid DESC LIMIT 1;');
                resolve(await stmt.get());
            } catch(e) {
                reject(e);
            }
        });
    }

    async registerUser(user, pass, email, user_uid) {
        return new Promise(async (resolve, reject) => {
            try {
                let stmt = await this.db.prepare('INSERT INTO users (username, password, email, user_uid) VALUES ( ?, ?, ?, ?)');
                resolve((await stmt.run(user, pass, email, user_uid)));
            } catch(e) {
                console.log(e);
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

    
    async getSavedTransactions(user_uid) {
        return new Promise(async (resolve, reject) => {
            try {
                let stmt = await this.db.prepare('SELECT * FROM user_data WHERE user_uid = ?');
                resolve(await stmt.all(user_uid));
            } catch(e) {
                reject(e);
            }
        });
    }

    async addTransaction(user_uid, recType, recDesc, recAmount) {
        return new Promise(async (resolve, reject) => {
            try {
                let stmt = await this.db.prepare('INSERT INTO user_data (user_uid,type,description,amount) VALUES (?, ?, ?, ?)');
                resolve((await stmt.run(user_uid, recType, recDesc, recAmount)));
            } catch(e) {
                reject(e);
            }
        });
    }

    async delTransaction(user_uid, transId) {
        return new Promise(async (resolve, reject) => {
            try {
                let stmt = await this.db.prepare('DELETE FROM user_data WHERE user_uid = ? and id = ?');
                resolve(await stmt.all(user_uid,transId));
            } catch(e) {
                reject(e);
            }
        });
    }

}

module.exports = Database;