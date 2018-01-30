var http_server = require("http"),
	ns = require('node-static'),											//a simple http server to serve static resource files from a local directory.
	urlSplitter = require('url'),
	server = http_server.createServer(req_proc),
	qs = require('querystring'),
	nodeStatic = new ns.Server('./public'),
	db = [{name: 'aaa', password: 'aaaaaa', avatar: "https://image.freepik.com/free-photo/cute-cat-picture_1122-449.jpg"},
		  {name: 'bbb', password: 'bbbbbb', avatar: "https://i0.wp.com/www.hoaxorfact.com/wp-content/uploads/2016/10/Picture-of-Amazing-Animal-Found-in-Nepal.jpg"},
		  {name: 'ccc', password: 'cccccc', avatar: "https://www.iansmartphotography.com/gallery/var/albums/Miscellaneous/Fruit%20Faces%2011JAN09%20013%20PS%204x4.jpg?m=1328927870"},
		  {name: 'ddd', password: 'dddddd', avatar: "http://www.adweek.com/files/blogs/wisest-kid-campbell-hed-2013.jpg"},
		  {name: 'eee', password: 'eeeeee', avatar: "https://stlyoungadults.com/wp-content/uploads/sites/4/2016/08/Angela-Richard-640x640-Pic.png"}];

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
	    rmessage = "0",														//login flag (server response message) is 0 by default
		res,																//splitted array by "&" with new user and password
	    db_str;																//database in string format

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
			if (q) {														  //don't expect that res is going to be empty, but it's a good manner
				for (var i=0; i < db.length; i++) {
					if (db[i].name == q.name) { 
						console.log ("User exists: " + db[i].name);
						response(response_from_server, 200, "text/plain", "");// such user exists
						break;
					} else {
						db.push({ name: q.name, password: q.password, avatar: q.avatar });//push new user to db
						console.log ("User was added: " + q.name);
						response(response_from_server, 200, "text/plain", "1"); //registered successfully
						break;
					}
				}
			}	
			break;
		case '/all':
			db_str = JSON.stringify(db);
			response(response_from_server, 200, "application/json", db_str);//returns stringified version of db
			break;
		case '/login':
			for (var i=0; i<db.length; i++) {
				if ((q.name == db[i].name) && (q.password == db[i].password)) {
					rmessage = db[i].name + "&" + db[i].avatar;				// returns user name and link to avatar = login success
					break;
				}
			}
			response(response_from_server, 200, "text/plain", rmessage);	//returns "0" or string with user name and avatar
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