var fs = require('fs'),
	dbModule,
	db, 		// Parsed database file
	i,			// for cycles
	obj = {},	// for response (return) 		

dbModule = {
	database: 'db.txt',

	/**
	 * Checks if user exist in database
	 * @param {string} username
	 * @param {string} password
	 * @returns {boolean} || {object}
	 */
	login: function(user, pass) {
		db = JSON.parse(fs.readFileSync(this.database, 'utf8')); //reads database file into array of objects [ {}, {}, {} ... ]
		for (i = 0; i < db.length; i++) {
			if ((db[i].name == user) && (db[i].password == pass)) { 
				obj.name = db[i].name;
				obj.ava = db[i].avatar;
				console.log ("Successfull login: " + user);
				return obj;
			}
		}
		console.log ("Unsuccessfull login: " + user);
		return false;
	},

	/**
	 * Adds new user in database
	 * @param {string} new_log
	 * @param {string} new_pass
	 * @param {string} new_ava
	 * @returns {string}||{boolean}
	 */
	register: function(log, pass, ava) {
		db = JSON.parse(fs.readFileSync(this.database, 'utf8')); 		 
		for (i = 0; i < db.length; i++) {
			if (db[i].name == log) { 
				console.log ("Unsuccessful registration, such user already exist: " + log);
				return false; 
			} 
		}
		console.log ("Successful registration: " + log);
		db.push({ name: log, password: pass, avatar: ava }); //push new user to db
		fs.writeFileSync(this.database, JSON.stringify(db));
		return log;
	},

	/**
	 * Gets database in string format database
	 * @returns {string}
	 */
	get_db: function() {
		return (fs.readFileSync(this.database, 'utf8'));
	}	
};

module.exports = dbModule;