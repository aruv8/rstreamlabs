var http_server = require("http"),
	ns = require('node-static'),
	urlSplitter = require('url'),
	server = http_server.createServer(request_procedure),
	qs = require('querystring'),
	nodeStatic = new ns.Server('./public'),
	db = [{name: 'cho', password: '111'}, {name: 'smith', password: '123'}];

server.listen(8080);
console.log("Server is running on 8080");



function request_procedure(request_to_server, response_from_server) {
	var u = urlSplitter.parse(request_to_server.url);
	    q = qs.parse(u.query),
	    rmessage = "0";
	if (request_to_server.url != "/favicon.ico") {
		console.log("Requested URL= ", request_to_server.url);
		console.log("Parsed query = ", q);
	}

	switch (u.pathname) {
		case "/favicon.ico":
			response(response_from_server, 200, "text/plain", "No icon");
			break;
		case '/data':
			response(response_from_server, 200, "text/html", "<p style='color:blue;'>sample data</p>");
			break;
		case '/login':
			for (var i=0; i<db.length; i++) {
				if ((q.name == db[i].name) && (q.password == db[i].password)) {
					rmessage = "1";	
					break;
				}
			}
			response(response_from_server, 200, "text/plain", rmessage);
			break;
		default:
			nodeStatic.serve(request_to_server, response_from_server);
			break;
	}
}

function response(resp, code, type, content) {
	resp.writeHead(code, {"Content-type": type});
	resp.write(content);
	resp.end();
}