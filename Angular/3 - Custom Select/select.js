var app = angular.module("select_app", []);

app.controller("contr", function($scope) {
	$scope.options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
	$scope.custom_option = $scope.options[0];

	$scope.custom_select = function ($index) {
		$scope.custom_option = $scope.options[$index];
		$scope.options_flag = false;
	}	
});