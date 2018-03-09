var app = angular.module('app1', []);

app.controller('mainCtrl', function($scope, $http) {
	//
	$scope.title = 'Angular HTTP test';

	$scope.url = "/somedata";

	$scope.someData = 'not loaded';

	$scope.getData = function() {
		//
		console.log('* loading data');
		//
		$http({
			url: $scope.url,
			method: 'get'
		}).success(function(data) {
			console.log('! got data', data);
			$scope.someData = data;
		}).error(function(data) {
			console.log('! error');
		})
	};

});