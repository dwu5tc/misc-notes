 

(function() {
	var app = angular.module('store', ['store-products']);

	app.controller('StoreController', [ '$http', function($http) {
		//this.product = gem;
		var store = this;

		store.products = [];

		$http.get('/products.json').success(function(data) {
			store.products = data; // can't just do this.products
		});
	}]);

	app.controller('PanelController', function() {
		this.tab = 1;

		this.selectTab = function(setTab) {
			this.tab = setTab;
		};

		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		};
	});

	app.controller('ReviewController', function() {
		this.review = {};

		this.addReview = function(product) {
			product.reviews.push(this.review);
			this.preview = {};
		};
	});

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
	}];
})();