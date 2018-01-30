var http_server = require("http"),
	ns = require('node-static'),											//a simple http server to serve static resource files from a local directory.
	urlSplitter = require('url'),
	server = http_server.createServer(req_proc),
	qs = require('querystring'),
	db_logic = require('./db_logic'), //connects a module with database logics
	nodeStatic = new ns.Server('./public');

server.listen(8080);
console.log("Server for Lab22 is running on http://127.0.0.1:8080");

/**
 * Database login request-response handler
 * @param {string} request_to_server
 * @param {string} response_from_server
 * @returns {string}
 */
function req_proc(request_to_server, response_from_server) {
	var u = urlSplitter.parse(request_to_server.url),
	    q = qs.parse(u.query),
		res,					//splitted array by "&" with new user and password
	    db_str;					//database in string format for /all request

	if (request_to_server.url != "/favicon.ico") {
		console.log("Requested URL= ", request_to_server.url);
		console.log("Parsed query = ", q);
	}

	switch (u.pathname) {											
		case "/favicon.ico":
		case "/lab22.css":
		case "/lab22.js":
			response(response_from_server, 200, "text/plain", "");  		  
			break;
		case '/register':
			if (db_logic.login(q.name) == "0") {	//if such user doesn't exist in database
				db_logic.register(q.name, q.password, q.avatar); //adds new user in database
				console.log("User successfully registered: " + q.name);
				response(response_from_server, 200, "text/plain", "1"); //registered successfully
			}	else {
				console.log("Such user already exist: " + q.name);
				response(response_from_server, 200, "text/plain", "");  // such user exists
			}
			break;
		case '/all':
			response(response_from_server, 200, "application/json", db_logic.get_db()); //returns parsed version of text database
			break;
		case '/login':
			response(response_from_server, 200, "text/plain", db_logic.login(q.name, q.password));	//returns "0" or string with user name and avatar
			break;
		default:
			nodeStatic.serve(request_to_server, response_from_server);		//other cases are handled by node static
			break;
	}
}

/**
 * Forms a response from the server
 * @param {string} 	resp
 * @param {integer} code
 * @param {string}  type
 * @param {} 		content
 * @returns {string}
 */
function response(resp, code, type, content) {
	resp.writeHead(code, {"Content-type": type});
	resp.write(content);
	resp.end();
}