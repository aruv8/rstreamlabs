//
function initPage(type) {
	console.log("Page init type: ", type);
} 

/**
 * Changes some fields if other ones were changed.
 *
 * @param {string} 	type 		[optional]	The sublist internal ID.
 * @param {string} 	name 	 			 	The field internal ID.
 * @param {string} 	linenum 	[optional]	Line number if this is a sublist. Line numbers start at 1, not 0.
 */
function fieldChange(type, name, linenum) { 
	console.log("Field changed: ", name);
	var s1, s2, $ = jQuery, d; // strings

	s1 = nlapiGetFieldValue("name");
	s2 = nlapiGetFieldValue("custrecord_art_free_form_text");

	if ((name == "name")&&(s1 != s2)) {
		nlapiSetFieldValue("custrecord_art_free_form_text", s1);
	}

	if (name == 'custrecord_art_checkbox') {
		//
		var c = nlapiGetFieldValue('custrecord_art_checkbox');
		if (c == 'T') {
			d = {
				name: nlapiGetFieldValue('name')
			};
			$.ajax({
				url: '/app/site/hosting/restlet.nl?script=customscript_vt_rest_test&deploy=customdeploy_vt_dpl_test',
				data: d
			}).done(function(data) {
				//
				console.log('get data!', data);
				nlapiSetFieldValue('custrecord_art_free_form_text', data);
			});
		}
	}

	if (name == 'custrecord_art_customers') {
		var cust = nlapiGetFieldValue('custrecord_art_customers');
		if (cust) {
			d = {
				cust: cust
			};
			$.ajax({
				url: '/app/site/hosting/restlet.nl?script=customscript_vt_rest_test&deploy=customdeploy_vt_dpl_test',
				data: d
			}).done(function(data) {
				//
				console.log('get data!', data);
				nlapiSetFieldValue('custrecord_art_free_form_text', data);
			});
		}
	}

	if (name == 'custrecord_art_selector') {
		//
		var intId = nlapiGetFieldValue("custrecord_art_selector"),
			r,
			orderNum;
		r = nlapiSearchRecord("salesorder", null, ["internalid","is", intId], [new nlobjSearchColumn("tranid"), new nlobjSearchColumn("custbody_promisedate")]);
		orderNum = r[0].getValue("tranid");
		console.log('Sales order number: ', orderNum);
	}
}

/**
 * Sends sales order # to server and gets data into a Long Text field.
 */
function pushThaButt() { 
	console.log("The Button has been pushed.");
	var $ = jQuery, sOrdNum; // strings

	sOrdNum = nlapiGetFieldValue('custrecord_art_selector');		// The Sales Order number (field value)
	
	if (sOrdNum) {
		$.ajax({
			url: '/app/site/hosting/restlet.nl?script=customscript_art_rest_test2&deploy=customdeploy_art_dpl_test2',
			data: {orderNumber: sOrdNum}
		}).done(function(data) {
			//
			console.log('Got data: ', data);
			nlapiSetFieldValue('custrecord_art_order_data_longtext', data);
		});
	} else {
		console.log('Error. There is no Sales Order selected; field "custrecord_art_selector"');
	}
}