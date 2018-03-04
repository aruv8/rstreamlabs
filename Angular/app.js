// app

var app = angular.module('myapp', []);

app.controller('myctrl', function($scope) {
	//
	$scope.title = "My app";
	$scope.x = '123';

	$scope.arr = ['one', 'two', 'three'];

	$scope.add = function() {
		$scope.arr.push($scope.x);
	};

	$scope.page = 'main';
	$scope.menu = [
		{label: 'Main page', code: 'main'},
		{label: 'About us', code: 'about'}
	];


	$scope.setPage = function(code) {
		$scope.page = code;
		console.log('code', code);
	};

	window.s = $scope;
});
