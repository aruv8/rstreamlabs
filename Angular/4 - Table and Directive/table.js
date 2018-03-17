var app = angular.module("tableApp", []);

app.controller("tableCtr", function($scope) {
	window.scope = $scope;
	$scope.tableDataObject = [
		{brand: "Lenovo",	CPU: "i7", 		color: "white", weight: 1.2,  price: 530},
		{brand: "ASUS",		CPU: "Ryzen 7",	color: "green", weight: 1.65, price: 330},
		{brand: "Dell",		CPU: "i5", 		color: "black", weight: 1.4,  price: 545},
		{brand: "HP",		CPU: "i7", 		color: "black", weight: 1.7,  price: 491},
		{brand: "Lenovo",	CPU: "i7", 		color: "white", weight: 1.9,  price: 571},
		{brand: "HP",		CPU: "Ryzen 7", color: "red", 	weight: 1.85, price: 399},
		{brand: "Lenovo",	CPU: "i5", 		color: "blue", 	weight: 1.4,  price: 571},
		{brand: "Lenovo",	CPU: "i5", 		color: "black", weight: 1.5,  price: 390},
		{brand: "HP",		CPU: "i7", 		color: "black", weight: 1.7,  price: 420},
		{brand: "ASUS",		CPU: "i5", 		color: "white",	weight: 1.1,  price: 414},
		{brand: "ASUS",		CPU: "Ryzen 5", color: "yellow",weight: 1.25, price: 430},
		{brand: "Lenovo",	CPU: "i3", 		color: "black", weight: 1.3,  price: 430},
		{brand: "HP",		CPU: "i3", 		color: "grey", 	weight: 1.7,  price: 500},
		{brand: "Dell",		CPU: "i5", 		color: "black", weight: 1.85, price: 420},
		{brand: "Dell",		CPU: "Ryzen 7", color: "black", weight: 2, 	  price: 730},
		{brand: "ASUS",		CPU: "i7", 		color: "black", weight: 1.6,  price: 890},
		{brand: "HP",		CPU: "Ryzen 5",	color: "green", weight: 1.2,  price: 621},
		{brand: "Lenovo",	CPU: "i5", 		color: "white", weight: 1.25, price: 491},
		{brand: "Lenovo",	CPU: "Ryzen 7", color: "black", weight: 1.5,  price: 484},
		{brand: "Lenovo",	CPU: "i7", 		color: "black", weight: 1.55, price: 551},
		{brand: "HP",		CPU: "i3", 		color: "black", weight: 1.5,  price: 425},
		{brand: "Dell",		CPU: "Ryzen 7", color: "red", 	weight: 1.8,  price: 611},
		{brand: "Lenovo",	CPU: "i5", 		color: "blue", 	weight: 1.4,  price: 315},
		{brand: "ASUS",		CPU: "i5", 		color: "black", weight: 1.5,  price: 404},
	];
});

app.directive("editable", function() {
	return {
		link: function (scope, elem, attrs) {
			// angular.element == $
			var $input,
				cell_value;

			console.log("Directive 'editable' is in progress.");

			elem.on("dblclick", function () {
				cell_value = elem.text();
				elem.text("");
				console.log("Element text: ", cell_value);
				$input = angular.element("<input>").attr({"type":"text", "value":cell_value}).appendTo(elem).focus();

				$input.on("blur", function () {
					if ($input.val()) {
						elem.text($input.val()); 
					}
					$input.remove();     			 
				});

				$input.keydown(function (e) {
					switch (e.keyCode) {
						case 13: 	// Enter key
						elem.text($input.val()); 	 
						$input.remove();     		 
						elem.focus();
						break;

						case 27: 	// Escape key
						$input.remove();
						angular.element((elem.text(cell_value))).focus(); // "cell_value" doesn't exist; focus stays on this td
						break;
					}
				});
			});
		}
	};
});

app.directive("literate", function() {
	return {
		link: function (scope, elem, attrs) {
			
		}
	};
});