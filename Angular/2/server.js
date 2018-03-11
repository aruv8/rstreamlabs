var http = require("http"),
	ns = require ("node-static"),
	server = http.createServer(req_proc),
	url_parser = require("url"),
	qs = require("querystring"),
	fs = require("fs"),
	file_data = "data.txt"
	static = new ns.Server("./public");

server.listen(8080);
console.log("Server is running on http://127.0.0.1:8080");

function req_proc(req, resp) {
	console.log("Request: ", req.url);

	var parsed_url = url_parser.parse(req.url),
		url = parsed_url.pathname,
		query = parsed_url.query,
		data = qs.parse(query),
		fdata = fs.readFileSync(file_data, 'utf8');
	switch (url) {
		case "/get_data_from_file":
			response(resp, fdata);
			break;
		case "/favicon.ico":
			response(resp);
			break;
		default:
			static.serve(req, resp);
	}
}

function response(resp, text, cont_type) {
	text = text || "";
	cont_type = cont_type || "text/plain";
	resp.writeHead(200, {"Content-Type": cont_type});
	resp.write(text);
	resp.end();
}