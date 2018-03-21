//
function initPage(type) {
	console.log("Page init type: ", type);
	generateCustomlistItems();
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

	if (name == "name") {
		console.log("Name field has been changed");		
	}

	if (name == 'custrecord_art_sales_order_test2') {
		//
		var intId = nlapiGetFieldValue("custrecord_art_sales_order_test2"),
			r,
			orderNum;

		r = nlapiSearchRecord("salesorder", null, ["internalid","is", intId], [new nlobjSearchColumn("tranid"), new nlobjSearchColumn("custbody_promisedate")]);
		orderNum = r[0].getValue("tranid");
		console.log('Sales order number: ', orderNum);
	}

	if (name == 'custpage_prod') {
		var str = nlapiGetFieldValue('custpage_prod');
		nlapiSetFieldValue('custrecord_art_free_form_text2', str);
	}

	if (name == 'custpage_aru_custom_assemblyitem_select') {
		var s = nlapiGetFieldValue('custpage_aru_custom_assemblyitem_select');	// gets selected option
		nlapiSetFieldValue('custrecord_art_assit_hid_st_forlist', s);	// writes the option to the regular text field for the purpose of storage
	}
}

/**
 * Generates records from existing list to dynamically created new one.
 */
function generateCustomlistItems() {
	//
	// Test List 1 (SCPQ Products)
	var r, r2;	// objects

	r = nlapiSearchRecord('customrecord_scpq_product', null, null, [new nlobjSearchColumn('altname')]);
	//nlapiInsertSelectOption('custpage_prod', "A", "Aaa", false);
	r.forEach(function(p) {
		//
		nlapiInsertSelectOption('custpage_prod', p.getId(), p.getValue('altname'), false);
	});
	nlapiSetFieldValue('custpage_prod', 1, false);
	

	// Test List 2 (Assembly Items)
	r2 = nlapiSearchRecord('assemblyitem', null, null, [new nlobjSearchColumn('itemid')]);
	r2.forEach(function(p) {
		//
		nlapiInsertSelectOption('custpage_aru_custom_assemblyitem_select', p.getId(), p.getValue('itemid'), false);
	});
	nlapiSetFieldValue('custrecord_art_assit_hid_st_forlist', 703, null);
}