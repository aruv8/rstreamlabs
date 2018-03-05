var server = require("http"),
	ns = require('node-static'),	  
	srv = server.createServer(req_proc),
	db_logic = require('./db_logic'), 
	splitter = require('./splitters'), 
	nodeStatic = new ns.Server('./public');

srv.listen(8080);
console.log("Server is running on http://127.0.0.1:8080");

/**
 * Database login request-response handler
 * @param {string} request_to_server
 * @param {string} response_from_server
 * @returns {object}
 */
function req_proc(req, resp) {
	var rdata = splitter.xsplit(req.url), //an object with path (i.e. /login) and data (i.e. {name:"---", password: "---"})
	    log_reg_Data,			// a result of login or register function, object or false
	    respo = {},				// a response from server, begins with status
	    the_whole_base;			// all the base in string format
	    
	    db_logic.check_hash_for_existence (req.headers.cookie, "hash");	// The function changes global flag (db_logic.correct_hash_flag) if the request from authorized user.

		switch (rdata.u) {											
			case "/favicon.ico":
				response(resp, 200, "text/plain", "");  		  
				break;
			case '/register':
				log_reg_Data = db_logic.register(rdata.q.name, rdata.q.password, rdata.q.avatar); 	//adds new user in database if it doesn't exist
				login_hash = db_logic.hash_generator(rdata.q.name);				// generates random hash for newly registered user
				respo = log_reg_Data ? {status: "ok", data: log_reg_Data, hash: login_hash} : {status: "error"}; 		//condition ? value-if-true : value-if-false
				db_logic.storedHashes.push(login_hash);							// stores generated hash in global array
				response(resp, 200, "application.json", JSON.stringify(respo));
				break;
			case '/all':
				if (db_logic.correct_hash_flag) {	// The hash received found in global array (request from authorized user) or user was jus registered.
						the_whole_base = db_logic.get_db();
						response(resp, 200, "application/json", the_whole_base); //returns json version of text database; add check
					break;
				}
				response(resp, 200, "text/plain", "Unauthorized access.");	
				break;
			case '/login':
				log_reg_Data = db_logic.login(rdata.q.name, rdata.q.password); 	// returns object or false
				login_hash = db_logic.hash_generator(rdata.q.name);				// generates random hash
				db_logic.storedHashes.push(login_hash);							// stores generated hash in global array
				respo = log_reg_Data ? {status: "ok", data: log_reg_Data, hash: login_hash} : {status: "error"};
				response(resp, 200, "application.json", JSON.stringify(respo));	
				break;
			default:
				nodeStatic.serve(req, resp);		//other cases are handled by node static
				break;
		}
}

/**
 * Forms a response from the server
 * @param {string} 	resp
 * @param {integer} code
 * @param {string}  type
 * @param {content} content
 * @returns {string}
 */
function response(resp, code, type, content) {
	resp.writeHead(code, {"Content-type": type});
	resp.write(content);
	setTimeout(function(){
		resp.end();	
	}, 10);
}