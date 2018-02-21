var querystr = require('querystring'),
    urlSplitter = require('url');
    

splitter = new Splitter ();

/**
 * Creates global object for the module
 *
 * {Constructor}
 */
function Splitter() {
	var xthis = this,
		path,      		// stores pathname
		returns = {};	
	/**
	 * Splits request to path
	 *
	 * @param {string} data
	 * @returns {object}
	 */
	this.xsplit = function (data) {
		path = urlSplitter.parse(data);
		returns.u = path.pathname;
		returns.q = querystr.parse(path.query);
		return (returns);
	}
};

module.exports = splitter;