function userEventBeforeLoad(type, form, request) {
    //
    if (type == "edit" || type == "create" || type == "copy") {
    	//
    	form.addFieldGroup("fieldGroup311", "Group_test2_2");
    	form.addField('custpage_prod', 'select', 'Select SCPQ product', null, 'fieldGroup311');

    	form.addFieldGroup("fieldGroup312", "Group_test2_3");
    	form.addField('custpage_aru_custom_assemblyitem_select', 'select', 'Select Assembly Item', null, 'fieldGroup312');
    }
}