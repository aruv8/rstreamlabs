var http_server = require("http"),
	ns = require('node-static'),	  //a simple http server to serve static resource files from a local directory.
	db_logic = require('./db_logic'), //connects a module with database logics
	splitter = require('./splitter'), //connects a module with url splitter for requests to server
	server = http_server.createServer(req_proc),
	nodeStatic = new ns.Server('./public');

server.listen(8080);
console.log("Server for Lab22 is running on http://127.0.0.1:8080");

/**
 * Database login request-response handler
 * @param {string} request_to_server
 * @param {string} response_from_server
 * @returns {object}
 */
function req_proc(request_to_server, response_from_server) {
	var rdata = splitter.xsplit(request_to_server.url), //an object with path (i.e. /login) and data (i.e. {name:"---", password: "---"})
	    log_reg_Data,			// a result of login or register function, object or false
	    respo = {},				// a response from server, begins with status
	    the_whole_base;			// all the base in string format

	switch (rdata.u.pathname) {											
		case "/favicon.ico":
		/*case "/lab22.css":
		case "/lab22.js":
		case "/resources/Lab22.css":
		case "/resources/Lab22.js":*/
			response(response_from_server, 200, "text/plain", "");  		  
			break;
		case '/register':
			log_reg_Data = db_logic.register(rdata.q.name, rdata.q.password, rdata.q.avatar); //adds new user in database if it doesn't exist
			respo = log_reg_Data ? {status: "ok", data: log_reg_Data} : {status: "error"}; //condition ? value-if-true : value-if-false
			response(response_from_server, 200, "application.json", JSON.stringify(respo));
			break;
		case '/all':
			the_whole_base = db_logic.get_db();
			response(response_from_server, 200, "application/json", the_whole_base); //returns json version of text database
			break;
		case '/login':
			log_reg_Data = db_logic.login(rdata.q.name, rdata.q.password); // returns object or false
			respo = log_reg_Data ? {status: "ok", data: log_reg_Data} : {status: "error"};
			response(response_from_server, 200, "application.json", JSON.stringify(respo));
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
 * @param {content} content
 * @returns {string}
 */
function response(resp, code, type, content) {
	resp.writeHead(code, {"Content-type": type});
	resp.write(content);
	resp.end();
}