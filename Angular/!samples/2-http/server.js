var http = require('http'),
	ns = require('node-static'),
	server = http.createServer(reqProc),
	urlParser = require('url'),
	qs = require('querystring'),
	static = new ns.Server('./public');

var lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

server.listen(8080);
console.log('< server is running at 8080 >');

function reqProc(req, resp) {
	//
	console.log('% request: ' + req.url);
	console.log('-- 1: ', req.headers['user-agent']);

	var parsedUrl = urlParser.parse(req.url),
		url = parsedUrl.pathname,
		query = parsedUrl.query,
		data = qs.parse(query);


	switch (url) {
		case '/somedata':
			writeBack(resp, lorem);
			break;
		case '/favicon.ico':
			writeBack(resp);
			break;
		default:
			static.serve(req, resp);
	}

}

function writeBack(resp, text, ct) {
	text = text || '';
	ct = ct || 'text/plain';
	resp.writeHead(200, {'Content-Type': ct});
	resp.write(text);
	resp.end();
}

