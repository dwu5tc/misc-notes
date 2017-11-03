(function() {
	var app = angular.module('store-products', []);

	app.directive('productTitle', function() { // dashes in HTML translate to camel case in JS
		return {
			restrict: 'E', // E = element
			templateUrl: 'product-title.html'
		};
	});

	app.directive('productGallery', function() {
		return {

		};
	});

	app.directive('productPanels', function() {
		return {
			restrict: 'E',
			templateUrl: 'product-panels.html',
			controller: function() {
				this.tab = 1;

				this.selectTab = function(setTab) {
					this.tab = setTab;
				};

				this.isSelected = function(checkTab) {
					return this.tab === checkTab;
				};
			},
			controllerAs: 'panels'
		};
	});
})();