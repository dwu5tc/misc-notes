// let = block scoped; not hoisted; cannot be redeclared

// for loops 
// when callbacks begin running, i holds the last value assigned to it from the for loop
// with let, no sharing between for loops; new variable created in each iteration
// each callback holds ref to its own version of i

// const = block scoped; not hoisted; cannot be reassigned; must be assigned initial value

// default function parameter values
function loadProfiles(userNames = []) {

}

// named parameters for optional settings
function setPageThread(name, { popular, expires, activeClass }) {

}
// but even better would be...
function setPageThread(name, { popular, epires, activeClass} = {}) {

}

// spread/rest + arrow func...

// objects and strings
// initializer shorthand --> if props have same name as their assigned variables
// destructuring..
// method initializer shorthand --> function keyword no longer needed
// template strings...

// object.assign
let settings = Object.assign({}, defaults, options); // merged props from defaults and options

// array destructuring...
// for ..of loop iterates over prop values (good for arrays and iterable objects)
// array.find() returns the 1st elem in the array that satisfies a provided testing function
let admin = users.find( user => user.admin);

// maps are data structures that store key/value pairs (dictionaries)
// problem with objects --> keys are always converted to strings
// trying to use an object as a key, key comes "object Object"
// exception --> key values are different types (use obj)
// maps are iterable (can use for... of loop)
// weak maps --> only objects can be passed as keys; not iterable; better for memory

// sets prevent duplicate entries; iterable
// weak sets --> cannot read values

// classes...

// modules
import * as flash from './flash-message';
flash.alertMessage('...');
flash.logMessage('...');

export { alertMessage, logMessage } // vs writing export in front of each function signature 

// promises
// http://campus.codeschool.com/courses/es2015-the-shape-of-javascript-to-come/level/6/section/1/video/1

// iterators
// http://campus.codeschool.com/courses/es2015-the-shape-of-javascript-to-come/level/6/section/2/video/1
let post = {
	title: 'es2015 features',
	replies: 19
};

post[Symbol.iterator] = function() {
	let properties = Object.keys(this);
	let count = 0;
	let isDone = false;

	let next = () => {
		if (count >= properties.length) {
			isDone = true;
		}
		return { done: isDone, value: this[properties[count++]] }; // ++ only increments count after it's read***
	}
	return { next };
};

// generators
// http://campus.codeschool.com/courses/es2015-the-shape-of-javascript-to-come/level/6/section/3/video/1
function *nameList() { // or function* nameList() or function * nameList()
	yield '...';
	yield '...';
}

post[Symbol.iterator] = function *() {
	let properties = Object.keys(this);
	
	for (let p of properties) {
		yield this[p];
	}
};
// hows this the same as above???

// destructuring...

// object rest and spread

// forEach, for.. in, for.. of

// async + await
