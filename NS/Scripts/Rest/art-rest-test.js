/**
 * Returns items, quantities, and prices from the Sales Order by it's number.
 *
 * @param {string} 	sOrdNum 	The Sales Order number, internal value.
 */
function artRest(dataIn) {
	//
	
	var data = JSON.parse(dataIn), 
		sOrdNum = data.orderNumber;

	if (sOrdNum) {
		var resp = [],
			order, count; // strings
		
		nlapiLogExecution('DEBUG', 'data input', sOrdNum);
		order = nlapiLoadRecord('salesorder', sOrdNum);	// Gets a whole Sales Order record 
		count = order.getLineItemCount('item');			// Gets a number of the records
		
		for (var i = 0; i < count; i++) {
			resp.push({
				item: order.getLineItemText('item', 'item', i+1),
				quantity: order.getLineItemValue('item', 'quantity', i+1),
				price: order.getLineItemValue('item', 'amount', i+1)
			}); 
		} 
		return JSON.stringify(resp);
	}
	return 'Error. There was no parameter passed with sales order number to the function';
}