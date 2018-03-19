var app = angular.module('app1', []);

app.controller('mainCtrl', function($scope, product, base64) {
	//
	$scope.title = 'Angular HTTP test';

	$scope.url = "/somedata";

	$scope.someData = 'not loaded';

	$scope.getData = function() {
		//
		console.log('* loading data');
		//
		var pr = product.get($scope.url);

		pr.success(function(data) {
			//
			$scope.someData = data;
		});
		
	};

	$scope.convert = function() {
		//
		console.log('* converting data');
		$scope.someData = base64.convert($scope.someData);
	};
});


app.factory('product', function($http) {
	//
	var p = {};

	p.get = function(url) {
		var pr = $http({
			url: url,
			method: 'get'
		}).success(function(data) {
			console.log('! got data', data);
		}).error(function(data) {
			console.log('! error');
		});
		return pr;
	};

	return p;
});


app.factory('base64', function() {
	//
	var b = {};

	b.convert = function(str) {
		return btoa(str);
	};

	return b;
});