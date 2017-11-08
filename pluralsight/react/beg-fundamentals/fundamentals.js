// jshint ignore: start


/*
 *	INTRODUCTION
 */

// props + state = model 
// declarative binding???

/*
 *	COMPONENTS
 */

// cross-origin errors...
// mongoose webserver
// serves everything to port 8080

(function() {
	'use strict';
	// code here
})();

// default props... whats the point though???
// are overridden by the props which are passed in

// proptypes
// can use own custom conditions
propTypes: {
	foo: React.PropTpes.string.isRequired,
	count: function(props, propName, componentName) {
		if (props[propName] < 5) {
			throw new Error(propName + ' must be >= 5.');
		}
	}
}

// mixins
// partial definition of a react component
// can be added to multiple other components 
var Highlight = {
	componentDidUpdate: function() { // called after each rendering
		var node = $(this.getDOMNode());
		node.slideUp();
		node.slideDown();
	}
};

// adding the mixin
var Count = React.createClass({
	mixins: [Highlight]
});

// better way than mixins???

/*
 *	JSX
 */

/*
 *	EVENTS
 */