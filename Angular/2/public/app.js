var app = angular.module("my-app", []);

app.controller("my-contr", function($scope, $http) {
	$scope.title = "Angular + Server";
	$scope.url = "/get_data_from_file";
	$scope.file_data = "Not loaded";

	$scope.get_data = function () {
		$http({url: $scope.url, method: "get"}).
			success(function(data) {$scope.file_data = data}).
			error(function(data) {alert("Check your request");})
	}
});