// function expression vs function declarations
// ...
// ... immediately invoked functions...

// closures...
// [...]
// https://stackoverflow.com/questions/111102/how-do-javascript-closures-work

var subPassengers = ['Luke', 'Leia', 'Han', 'Chewie', 'Yoda', 'R2D2'];
// doesn't work --> alerts 6
function assignTorpedo(name, passengerArray) {
	var torpedoAssignment;
	for (var i = 0; i<passengerArray.length; i++) {
		if (passengerArray[i] === name) {
			torpedoAssignment = function() {
				alert('' + name + '... Man your post at Torpedo #' + (i+1) + '!');
			};
		}
	}
	return torpedoAssignment;
}

// following 2 examples work --> alert 4
function assignTorpedo(name, passengerArray) {
	var torpedoAssignment;
	for (var i = 0; i<passengerArray.length; i++) {
		if (passengerArray[i] === name) {
			return function() {
				alert('' + name + '... Man your post at Torpedo #' + (i+1) + '!');
			};
		}
	}
}

function assignTorpedo(name, passengerArray) {
	var torpedoAssignment;
	for (var i = 0; i<passengerArray.length; i++) {
		if (passengerArray[i] === name) {
			torpedoAssignment = function() {
				alert('' + name + '... Man your post at Torpedo #' + (i+1) + '!');
			};
			break;
		}
	}
	return torpedoAssignment;
}

// or could put the loop logic inside the return function

var giveAssignment = assignTorpedo('Chewie', subPassengers);
giveAssignment();

// hoisting
// function expression are never hoisted

// objects
// prototypes
String.prototype.foo = function(bar) {
	// ...
	return bar;
};

/// inheritance, constructors, prototypal methods
var magicFoo = Object.create(foo);
Object.prototype.isPrototypeOf(foo); // true
foo.isPrototypeOf(magicFoo); // true
magicFoo.isPrototypeOf(foo); // false

function Shoe(size, color, gender, style) {
	this.size = size;
	this.color = color;
	this.gender = gender;
	this.style = style;
}
Shoe.prototype = {
	putOn: function() { alert("Shoes on!"); },
	takeOff: function() { alert("Shoes off!"); }
};

// these two are the same
someObject.contructor.prototype;
sameObject.__proto__;

Object.prototype.findOwnerOfProperty = function(prop) {
	var currObj = this;
	while (curObj !== null) {
		if (currObj.hasOwnProperty(prop)) {
			return currObj;
		}
		else {
			currObj = currObj.__proto__;
		}
	}
	return 'No property found!';
};



