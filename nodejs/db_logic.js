/* A module for logical work with database */

var fs = require('fs'),
	dbModule,
	db, 	// Parsed database file
	i, 		

dbModule = {
	database: 'database.txt',

	/**
	 * Checks if user exist in database
	 * @param {string} username
	 * @param {string} password [optional]
	 * @returns {string}
	 */
	login: function(username, pswd) {
		db = JSON.parse(fs.readFileSync(this.database, 'utf8')); //reads database file into array of objects [ {}, {}, {} ... ]
		//console.log (db.length + " " + username + " " + pswd);
		if (pswd) { 	// If optional parameter password exists
			for (i = 0; i < db.length; i++) {
				if ((db[i].name == username) && (db[i].password == pswd)) { 
					console.log ("User exist: " + db[i].name);
					return (db[i].name + "&" + db[i].avatar);
				}
			}
			console.log ("Unsuccessfull login: " + username);
			return "0";
		} else { // If checked only username
			for (i = 0; i < db.length; i++) {
				if (db[i].name == username) { 
					console.log ("User exist: " + username);
					return username; //user exists
				} 
			}
			return "0";
		}
	},

	/**
	 * Adds new user in database
	 * @param {string} new_log
	 * @param {string} new_pass
	 * @param {string} new_ava
	 * @returns {boolean}
	 */
	register: function(new_log, new_pass, new_ava) {
		db = JSON.parse(fs.readFileSync(this.database, 'utf8')); 		 //reads database file into array of objects [ {}, {}, {} ... ]
		db.push({ name: new_log, password: new_pass, avatar: new_ava }); //push new user to db
		fs.writeFileSync(this.database, JSON.stringify(db));
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