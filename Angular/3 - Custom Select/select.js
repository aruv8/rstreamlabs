var app = angular.module("select_app", []);

app.controller("contr", function($scope) {
	$scope.options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
	
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
	$scope.custom_option = $scope.options[0];

	$scope.custom_select = function ($index) {
		$scope.custom_option = $scope.options[$index];
		$scope.options_flag = false;
	};
});