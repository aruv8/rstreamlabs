/* A module for splitting requests to server work with  */

var qs = require('querystring'),
    urlSplitter = require('url'),

	u,
	q,
	obj = {},	// contain returns

splitter = {

	/**
	 * Splits request to path
	 * @param {string} data
	 * @returns {object}
	 */
	xsplit: function (data) { //request_to_server.url in data
		obj.u = urlSplitter.parse(data);
		obj.q = qs.parse(obj.u.query);

		if (data != "/favicon.ico") {
			console.log("Requested URL= ", data);
			console.log("Parsed query = ", obj.q);
		}

		return (obj);
	}
};

module.exports = splitter;