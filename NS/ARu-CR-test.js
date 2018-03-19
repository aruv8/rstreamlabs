//
function initPage(type) {
	console.log("Page init type: ", type);
} 

// type : the sublist internal ID
// name : the field internal ID
// linenum : line number if this is a sublist. Line numbers start at 1, not 0.
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
}

