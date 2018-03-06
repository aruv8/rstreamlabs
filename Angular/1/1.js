var login_app = angular.module("login_module", []);

login_app.controller("login_controller", function ($scope){
	//
	$scope.title = "Login Form";
	$scope.db = [];		// database
	$scope.page = "registrationPage";
	$scope.menu = [
		{label: "Login", code: "loginPage"},
		{label: "Registration", code: "registrationPage"}
	];
	$scope.usr = "";
	$scope.psw = "";
	$scope.log = "";
	$scope.pas = "";


	$scope.setPage = function(code) {
		$scope.page = code;
	};

	$scope.addUser = function() {
		$scope.db.push({"user": $scope.usr, "pass": $scope.psw});
	};

	$scope.checkBase = function() {
		for (var i = 0; i < $scope.db.length; i++) {
			if (($scope.log == $scope.db[i].user) && ($scope.pas == $scope.db[i].pass)) {
				$scope.page = "successPage";
				return;
			} 
		}
		$scope.page = "unsuccessPage";
	};

	window.s = $scope;
});