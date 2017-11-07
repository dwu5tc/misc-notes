// enhance html -->
// js generate html -- > react
// virtual DOM
// write diff between old and new tree: tree reconcilliation

// function component
// stateless 

// class component 
// stateful
// can change internal state
// props are fixed
// no need to write jsx

// jsx compiled to javascript which calls React.createElement

// instead of 
constructor(props) {
	super(props);
	this.state= { counter: 0 };
}

// new ES2015
state = { counter: 0 };

// no need to bind with ES2015
// but somewhere said arrow functions aren't good and should use binding???
handleClick = () => {
	this.setState({
		counter: this.state.counter + 1
	});
};

// setState = asynchronous and just schedules an update
// multiple calls might be batched for performance
// since both reading + writing to the state obj in this example
// might hit a race condition..
// generally when need to update state using a val from current state
// use the other contract of setState method
// function instead of an obj
handleClick = () => {
	this.setState((prevState) => ({
			counter: prevState.counter + 1
	}));
};

// ***bind method or function wrapper method has flaws
// creating a new function for every rendered button
// avoid by doing this...

// this is bad
class Button extends React.Component {
	render() {
		return (
			<button
				onClick={() => this.props.onClickFunction(this.props.incrementVaue)}
			>
			+{this.props.incrementValue}
			</button>
		);
	};
}