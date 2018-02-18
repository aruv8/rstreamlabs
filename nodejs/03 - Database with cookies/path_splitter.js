var querystr = require('querystring'),
    urlSplitter = require('url'),
    path,      		// stores pathname
	returns = {},	

splitter = {

	/**
	 * Splits request to path
	 * @param {string} data
	 * @returns {object}
	 */
	xsplit: function (data) {
		path = urlSplitter.parse(data);
		returns.u = path.pathname;
		returns.q = querystr.parse(path.query);
		return (returns);
	}
};

module.exports = splitter;