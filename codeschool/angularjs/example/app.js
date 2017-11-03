 

(function() {
	var app = angular.module('store', []);

	app.controller('StoreController', function() {
		this.product = gem;
	});

	app.controller('PanelController', function() {
		this.tab = 1;

		this.selectTab = function(setTab) {
			this.tab = setTab;
		};

		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		}
	});

	app.controller('ReviewController', function() {
		this.review = {};

		this.addReview = function(product) {
			product.reviews.push(this.review);
			this.preview = {};
		};
	});

	app.directive('productTitle', function() { // dashes in HTML translate to camel case in JS
		return {
			restrict: 'E', // E = element
			templateUrl: 'product-title.html'
		};
	};

	var gems = [
	{
		name: 'Dodecahedron',
		price: 2.95,
		description: '...',
		images: [
		{
			full: 'do-1-full.jpg',
			thumb: 'do-1-thumb.jpg'
		},
		{
			full: 'do-2-full.jpg',
			thumb: 'do-2-thumb.jpg'
		}
		],
		canPurchase: false,
		soldOut: true
	},
	{
		name: 'Pentagonal Gem',
		price: 5.95,
		description: '...',
		canPurchase: false,
		soldOut: true
	}
	];
})();