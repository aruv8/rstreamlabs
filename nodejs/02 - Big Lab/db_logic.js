/* A module for logical work with database */

var fs = require('fs'),
	dbModule,
	db, 		// Parsed database file
	i,			// for cycles
	obj = {},	// for response (return) 		

dbModule = {
	database: 'database.txt',

	/**
	 * Checks if user exist in database
	 * @param {string} username
	 * @param {string} password
	 * @returns {object}||{boolean}
	 */
	login: function(username, pswd) {
		db = JSON.parse(fs.readFileSync(this.database, 'utf8')); //reads database file into array of objects [ {}, {}, {} ... ]
		for (i = 0; i < db.length; i++) {
			if ((db[i].name == username) && (db[i].password == pswd)) { 
				obj.name = db[i].name;
				obj.ava = db[i].avatar;
				console.log ("Successfull login: " + username);
				return obj;
			}
		}
		console.log ("Unsuccessfull login: " + username);
		return false;
	},

	/**
	 * Adds new user in database
	 * @param {string} new_log
	 * @param {string} new_pass
	 * @param {string} new_ava
	 * @returns {string}||{boolean}
	 */
	register: function(new_log, new_pass, new_ava) {
		db = JSON.parse(fs.readFileSync(this.database, 'utf8')); 		 
		for (i = 0; i < db.length; i++) {
			if (db[i].name == new_log) { 
				console.log ("Unsuccessful registration, such user already exist: " + new_log);
				return false; 
			} 
		}
		console.log ("Successful registration: " + new_log);
		db.push({ name: new_log, password: new_pass, avatar: new_ava }); //push new user to db
		fs.writeFileSync(this.database, JSON.stringify(db));
		return new_log;
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