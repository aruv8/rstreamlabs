function vtRest(dataIn) {
	//
	var resp;
	nlapiLogExecution('DEBUG', 'data input', dataIn);
	dataIn = JSON.parse(dataIn);

	if (dataIn.name) {
		var count = dataIn.name.length;
		resp = 'Name length is '+count;
	}
	if (dataIn.cust) {
		var r = nlapiSearchRecord('customer',null,['internalid','is',dataIn.cust], [new nlobjSearchColumn('comments')]);

		resp = r[0].getValue('comments');
	}
	return resp;
}