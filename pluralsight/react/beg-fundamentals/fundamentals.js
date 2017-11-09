

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
	foo: React.PropTypes.string.isRequired,
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


// each element transformed into a JS function call

// no need to use JSX
// can go straight to JS and write JS functions

// <Hello /> --> Hello(null)
// <div> --> React.DOM.div(null)

// pre-process transformer (vs just-in-time transfomer)
// transform done as a build step
// faster than JIT
// npm install -g react-tools
// jsx jsxdirectory/ compiledjs/
// jsx --watch jsxdirectory/ compiledjs/

// this.props.children
// renders the child components
// <Appender>
// 		<First />
// 		<Second />
// </Appender>

var Appender = React.createClass({
	render: function() {
		return ( 
			<div className="appender">
				{this.props.children} 
			</div>;
		);
	}
});
// will render the First and Second components

// attributes must be valid according to HTML specification 
// custom attributes supported via data-
// <div myCustomAttribute="foo" /> won't work
// <div data-myCustomAttribute="foo" /> will work

// cannot use reserved JS words
// for --> htmlFor; class --> className

// HTML style attributes
// {{ ... }} double curly braces 
// outer curly braces delimt JSX expression; inner delimits JS object literal

/* can do...
var s = {
	margin: '5px',
	padding: '5px'
}
return <div style={s}>... */

// react escapes everything by default
// escaped content = string representation of HTML (not interpreted as HTML)
// bypass --> <div dangerouslySetInnerHTML={{__html="<p>foo</p>"}} />


/*
 *	EVENTS
 */


// react has its own event abstraction (on top of its own DOM abstraction) 
// uniform event system for DOM events and component events
// syntheticevent
// original event obj available via nativeevent prop

handleChange: function(e) { // e = instance of the react syntheticevent type
	console.log(e.target.value); // e.target = text input DOM element
	// e.target.value = contains value of the textbox
}

// component events
// typically at a higher abstraction than browser events
// e.g task added, priority changed
var Timer = React.createClass({
	propTypes: {
		onInterval: React.PropTypes.func.isRequired,
		interval: React.PropTypes.number.isRequired
	},
	render: function() {
		return <div style={{ display: 'none' }}/>;
	},
	componentDidMount: function() {
		setInterval(this.props.onInterval, this.props.interval);
	}
});

function thingToDo() { console.log('tick'); }

React.renderComponent(<Timer onInterval={thingToDo} interval={1000} />,
	document.body);

// React.initializeTouchEvents(true) for touchscreens
// adds onTouchStart, onTouchEnd, ...Move, ...Cancel

/*
 *	FORMS
 */

// controlled component...

// uncontrolled component
// cause the rendered DOM to diverge from React's model of the DOM
// defaultValue --> gives textbox a starting value

// refs
// provide a way to reference owned components
// ref attribute on react DOM component names the component instance
// access the element via this.refs.<element name>
render: function() {
	return <input ref="inp" type="text" />
},
componentDidMount: function() {
	this.refs.inp.getDOMNode().value = "set by ref";
}

// client-side routing with HTML5 pushstate (aka history???)
// allows JS to update the browser URL without triggering a req to the server
// advantage --> indistinguishable from normal URLs used with server-side applications
// implemented properly, enables proper refresh behaviour and bookmarking
// but requires that browser supports pushstate

// hash fragments...
// don't really understand???

// routing the author quiz

// retrieving form values
function getRefs(component) {
	var result = {};
	Object.keys(component.refs).forEach(function(refName) {
		result[refName] = component.refs[refName].getDOMNode().value;
	});
	return result;
}

// using above function
// within a class component...
handleSubmit: function() {
	var data = getRefs(this);
	this.props.doSomething(data);
}