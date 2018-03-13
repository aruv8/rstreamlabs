var app = angular.module("select_app", []);

app.controller("contr", function($scope) {
	$scope.formData = {};
	$scope.showDropdown = null;
	$scope.search_field = "";
	window.scope = $scope; // to use variables from here in html

	$scope.custSelect = [
		{
			name: 'Select CPU',
			code: 'CPU',
			options: ['celeron','pentium','i3','i5','i7']
		},
		{
			name: 'Select RAM size',
			code: 'RAM',
			options: ['4Gb','8Gb','16Gb']
		},
		{
			name: 'select OS',
			code: 'OS',
			options: ['Linux','Windows','Mac OS']
		}
	];

	$scope.custom_select = function (opt, code) {
		console.log(opt);
		$scope.showDropdown = null;
		$scope.formData[code] = opt;
	};
	
	$scope.showdrop = function (code) {
		$scope.showDropdown = code;
	};

	$scope.isGood = function (option, filt) {
		console.log ("Option: ", option);
		console.log ("Filt: ", filt);

		var new_option;
		new_option = option.indexOf(filt);
		if (new_option != -1) {
			console.log("New option: ", new_option);
			return new_option + 1;
		}
	}

});