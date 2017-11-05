// ternary
// can nest...
console.log('Current weapon: ' + (isArthur && isKing ? 'Excalibur' : 'Longsword'));

// logical or
// if all elements falsy, last value assigned 
this.foo = this.foo || 'bar'; 

// logical and...

// switch block
// fall-through can be useful

// loop optimization
// cache values
for (var i = 0; i < treasureChest.necklaces.length; i++) {
	console.log(treasureChest.necklaces[i]);
}

var list = treasureChest.necklaces;
for (var i = 0, x = list.length; i < x; i++) {
	console.log(list[i]);
}

// script execution
// relocate work-intensive scripts to the bottom of the page
// use HTML5 aysnc attribute

// short performance tips

// add common methods to obj prototype
// necessary if using classes?

// use document fragments to append all DOM elements at once
// instead of appending a single element at a time

var fragment = document.createDocumentFragment(),
	elem;
for (var i = 0, x = foo.length; i < x; i++) {
	elem = document.createElement('li');
	elem.appendChild(document.createTextNode(foo[i]));
	fragment.appendChild(elem);
}
document.getElementById('foo').appendChild(fragment);

// concatentating strings
// += generall good
// .join for array of strings (not +=)

// measuring performance
// console.time and console.timeEnd

var startTime = +new Date(); // + unary operator indicates math op and tries to convert element into number
var endTime = +new Date();
var elapsedTime = endTime - startTime;

// with a speed test class
// http://campus.codeschool.com/courses/javascript-best-practices/level/2/section/5/video/1

// careful comparisons
// use ===
// use instanceof for classes

// error handling
// try catch blocks
// throw new Error

// stuff that sucks
// with() sucks; use variables to cache instead
// eval() sucks
// not using curly braces sucks

// number stuff
// parseInt(number, 10); 
// check for number presence first
// to check for number --> typeof data === 'number' && !isNaN(data)***
// typeof NaN is a number and thus second part is necessary 

// namespacing 
// capitalization by convention
var FOO = {
	// code here
};

// anonymous closures
var ARMORY = (function() {
	var weaponList = []; // invisible
	var armostList = [];

	var removeWeapon = function() {}; // invisible
	var replaceWeapon = function() {};
	var removeArmor = function() {};
	var replaceArmor = function() {};

	return {
		makeWeaponRequest: function() {}, // visible
		makeArmorRequest: function() {}
	};
})();

// global imports
var wartime = true;
var ARMORY = (function(war) {
	// code here
})(wartime);

// augmentation 
// http://campus.codeschool.com/courses/javascript-best-practices/level/4/section/4/video/1
ARMORY = (function(oldNamespace) {
	// code here
	return oldNamespace;
	// new properties will not have access to the private data from the previous closure***
})(ARMORY);









