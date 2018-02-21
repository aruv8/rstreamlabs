var fs = require('fs');

var dbModule = new DbModule();

/**
 * Creates global object for the module
 *
 * {Constructor}
 */
function DbModule() {
	var xthis = this,
		database = "db.txt",
		db, 		// Parsed database file
		obj = {};	// for response (return) 		
	
	// Global variables to be accessed from the server 
	this.storedHashes = [];			// The storage of all of the authorized hashes.
	this.correct_hash_flag = false;	// True if the request from the authorized user.

	/**
	 * Checks if user exist in database
	 * @param {string} username
	 * @param {string} password
	 * @returns {boolean} || {object}
	 */
	this.login = function(user, pass) {
		db = JSON.parse(fs.readFileSync(database, 'utf8')); //reads database file into array of objects [ {}, {}, {} ... ]
		for (var i = 0; i < db.length; i++) {
			if ((db[i].name == user) && (db[i].password == pass)) { 
				obj.name = db[i].name;
				obj.ava = db[i].avatar;
				console.log ("Successfull login: " + user);
				return obj;
			}
		}
		console.log ("Unsuccessfull login: " + user);
		return false;
	};

	/**
	 * Adds new user in database
	 * @param {string} new_log
	 * @param {string} new_pass
	 * @param {string} new_ava
	 * @returns {string}||{boolean}
	 */
	this.register = function(log, pass, ava) {
		db = JSON.parse(fs.readFileSync(database, 'utf8')); 		 
		for (var i = 0; i < db.length; i++) {
			if (db[i].name == log) { 
				console.log ("Unsuccessful registration, such user already exist: " + log);
				return false; 
			} 
		}
		console.log ("Successful registration: " + log);
		db.push({ name: log, password: pass, avatar: ava }); //push new user to db
		fs.writeFileSync(database, JSON.stringify(db));
		return log;
	};

	/**
	 * Gets database in string format database
	 * @returns {string}
	 */
	this.get_db = function() {
		return (fs.readFileSync(database, 'utf8'));
	};

	/**
	 * Generates random number and converts it to base 36
	 * @returns {string}
	 */
	this.random_generator = function() {
    	return Math.random().toString(36).substr(2); // remove "0"
	};

	/**
	 * Generates hash by double call of random generator
	 * @returns {string}
	 */
	this.hash_generator = function() {
	    return xthis.random_generator() + xthis.random_generator();
	};

	/**
	 * Gets key value from the cookies sent to the server
	 *
	 * @param {string} src
	 * @param {string} key
	 * @returns {string}
	 */
    this.read_cookie = function (src, key) {
	    var keyEQ = encodeURIComponent(key) + "=";
	    var ca = src.split(';');
	    
	    for (var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) === ' ')
	            c = c.substring(1, c.length);
	        if (c.indexOf(keyEQ) === 0)
	            return decodeURIComponent(c.substring(keyEQ.length, c.length));
	    }
	    return null;
	};

	/**
	 * Appends global array of hashes if a new hash is unique.
	 *
	 * @param {string} src
	 * @param {string} key	 
	 * @returns {boolean}
	 */
	this.check_hash_for_existence = function (src, key) {
		var hash = xthis.read_cookie(src, key);

		console.log("Current Hash: ", hash);
		xthis.correct_hash_flag = false;
		if (hash) {
			for (var i = 0; i < xthis.storedHashes.length; i++) {
				if (xthis.storedHashes[i] == hash) {
					xthis.correct_hash_flag = true;
				}
			}
		}
	}
};

module.exports = dbModule;