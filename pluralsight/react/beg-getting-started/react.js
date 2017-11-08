// jshint ignore: start


/*
 *	INTRODUCTION
 */


// enhance html --> angular 
// js generate html -- > react
// virtual DOM
// write diff between old and new tree: tree reconcilliation

// functional component = stateless 

// class component = stateful
// can change internal state
// props are fixed

// no need to write jsx
// jsx compiled to javascript which calls React.createElement

// instead of... 
constructor(props) {
	super(props);
	this.state= { counter: 0 };
}

// leverage ES2015... ??? check this
state = { counter: 0 };

// no need to bind with ES2015
// but somewhere said arrow functions aren't good and should use binding??? check this
handleClick = () => {
	this.setState({
		counter: this.state.counter + 1
	});
};

// setState = asynchronous and just schedules an update
// multiple calls might be batched for performance
// since both reading + writing to the state obj in this example...
// might hit a race condition... ???
// generally when needing to update state using a val from current state
// use the other contract of setState method...
// involving a function instead of an obj
handleClick = () => {
	this.setState((prevState) => ({
			counter: prevState.counter + 1
	}));
};

// ***bind method or function wrapper method has flaws
// creates a new function for every rendered button
// avoid by doing this...

// this is bad!!!
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

// better!!!
class Button extends React.Component {
	handleClick = () => {
		this.setState((prevState) => ({
			counter: prevState.counter + 1
		}));
	};

	render() {
		return (
			<button 
				onClick={thi.handleClick}
			>
			+{this.props.incrementValue}
			</button>
		);
	}
}
// difference between Button (react) and button (html)???


/*
 *	WORKING WITH DATA
 */


// only use class-based components when need to manage state (usually top-level) or need personalized event handlers
const Card = (props) => {
	return (
		<div style={{margin: '1em'}}>
			<img width="75" src={props.avatar_url} />
			<div style={{display: 'inline-block', marginLeft: 10}}>
				<div style={{fontSize: '1.25em', fontWeight: 'bold'}}>
					{props.name}
				</div>
				<div>{props.company}</div>
			</div>
		</div>
	);
}

const CardList = (props) => {
	// will this pass the card.id twice???
	return (
		<div>
			{props.cards.map(card => <Card 
					key={card.id}
					{...card} 
				/>)}
		</div>
	);
}

class Form extends React.Component {
	state = { userName: '' }

	// every React event func receives an event argument
	// this event obj is a wrapper around the native JS event obj
	handleSubmit = (e) => {
		e.preventDefault();
		axios.get(`https://api.github.com/users/${this.state.userName}`)
			.then(resp => {
				this.props.onSubmit(resp.data);
				this.setState({ userName: '' });
			});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input type="text" 
					onChange={(e) => this.setState({ userName: e.target.value })}
					/*ref={(input) => this.userNameInput = input}*/
					placeholder="Github Username" required /> 
				<button type="submit">Add Card</button>
			</form>
		);
	}
}
// check what input required does???
// using ref --> uncontrolled component 
// e.target.value??? check what e is and what e.target is

class App extends React.Component {
	state = {
		cards:[
			// ...
		]
	}

	addNewCad = (cardInfo) => {
		this.setState(prevState => ({
			cards: prevState.cards.concat(cardInfo)
		}));
	}
	// why not spread operator???

	render() {
		return (
			<div>
				<Form 
					onSubmit={this.addNewCard}
				/>
				<CardList 
					cards={this.state.cards} 
				/>
			</div>
		);
	}
}

ReactDOM.render(<Card />, mountNode);


/*
 *	BUILDING A GAME
 */

// bit.ly/psreact15
const Stars = (props) => {
	// needed to move this up one level because
	// this component would get re-rendered (with a new random numberOfStars)
	// every time we selected a new number 
	// const numberOfStars = Game.randomNumber();

	// let stars = [];
	// for (let i = 0; i < numberOfStars; i++) {
	// 	stars.push(<i key={i} className="fa fa-star"></i>);
	// }
	return (
		<div>
			{_.range(props.numberOfStars).map(i =>
				<i key={i} className="fa fa-star"></i>
			)}
		</div>
	);
}

const Button = (props) => {
	let button;
	switch(props.answerIsCorrect){
		case true:
			button = 
				<button className="btn btn-success"
						onClick={props.acceptAnswer}
				>
					<i className="fa fa-check"></i>
				</button>
			break;
		case false:
			button = 
				<button className="btn btn-danger">
					<i className="fa fa-times"></i>
				</button>
		default:
			button = 
				<button className="btn"
					onClick={props.checkAnswer}
					disabled={props.selectedNumbers.length === 0}
				>
					=
				</button>
			break;
	}

	return (
		<div>
			{button}
			<button className="btn btn-warning"
				onClick={props.redraw}
				disabled={props.redraws === 0}
			>
				<i className="fa fa-refresh"></i> {props.redraws}
			</button>
		</div>
	);
}

const Answer = (props) => {
	return (
		<div>
			{props.selectedNumbers.map((number, i) =>
				<span key={i}
					onClick={() => props.unselectNumber(number)}
				>
					{number}
				</span>
			)}
		</div>
	);
}

const Numbers = (props) => {
	// const arrayOfNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const numberClassName = (number) => {
		if (props.usedNumbers.indexOf(number) >= 0 ) {
			return 'used';
		}
		if (props.selectedNumbers.indexOf(number) >= 0) {
			return 'selected';
		}
	}

	// should probably upgrade this component to a class component with its own event handler because
	// the arrow function for onClick creates a new function for every number...
	return (
		<div>
			{Numbers.list.map((number, i) => 
				<span key={i} 
					className={numberClassName(number)}
					onClick={() => props.selectNumber(number)}
				>
					{number}
				</span>
			)}
		</div>
	);
}

// all funcs are objs so you can store data
// do this when the var will be shared exactly as is by all instances of the component
// and not related to any logic inside the component 
Numbers.list = _.range(1, 10); // with lodash

const DoneFrame = (props) => {
	return (
		<div>
			<h2>{props.doneStatus}</h2>
			<button
				onClick={props.resetGame}
			>Play Again</button>
		</div>
	);
}

class Game extends React.Component {
	static randomNumber = () => 1 + Math.floor(Math.random() * 9); // what is static???
	// selectedNumbers is an array here (simplicity) but...
	// objects are faster than arrays for lookup
	
	static initialState = () => ({
		selectedNumbers: [],
		randomNumberOfStars: Game.randomNumber(),
		usedNumbers: [],
		answerIsCorrect: null, // would be better to define answerState here instead of null for logic
		redraws: 5,
		doneStatus: null
	});
	
	state = Game.initialState();

	resetGame = () => this.setState(Game.initialState());

	selectNumber = (clickedNumber) => {
		if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
		this.setState(prevState => ({
			answerIsCorrect: null,
			selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
		}));
	};

	unselectNumber = (clickedNumber) => {
		this.setState(prevState => ({
			answerIsCorrect: null,
			selectedNumbers: prevState.selectedNumbers
									.filter(number => number !== clickedNumber)
		}));
	};

	checkAnswer = () => {
		// ***usually don't place any values that can be calculated on the state
		// but for simplicity sake here
		this.setState(prevSate => ({
			answerIsCorrect: prevState.randomNumberOfStars ===
				prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
		}));
	};

	acceptAnswer = () => {
		this.setState(prevState => ({
			usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
			selectedNumbers: [],
			answerIsCorrect: null,
			randomNumberOfStars: Game.randomNumber()
		}), this.updateDoneStatus); // will run after setState finishes
		// setState = asynchronous
		// no guarantee that 2 setStates will happen sequentially
		// ***so this.updateDoneStatus must be called this way
	};

	redraw = () => {
		if (this.state.redraws === 0 ) { return; }
		this.setState(prevState => ({
			randomNumberOfStars: Game.randomNumber(),
			answerIsCorrect: null,
			selectedNumbers: [],
			redraws: prevState.redraws - 1
		}), this.updateDoneStatus);
	};

	possibleSolutions = ({ randomNumberOfStars, usedNumbers }) => { // destructure from state b/c don't need everything
		const possibleNumbers = _.range(1, 10).filter(number => 
			usedNumbers.indexOf(number) === -1
		);

		return possibleCominbationSum(possibleNumbers, randomNumberOfStars); // pretend this function works
		// what is << operator
	};

	updateDoneStatus = () => {
		this.setState(prevState => {
			if (prevState.usedNumbers.length === 9) {
				return { doneStatus: 'Done. Nice!' };
			}
			if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
				return { doneStatus: 'Game Over!' };
			}
		});
	};

	render() {
		const { 
			selectedNumbers, 
			randomNumberOfStars,
			usedNumbers, 
			answerIsCorrect,
			redraws,
			doneStatus
		} = this.state;
		return (
			<div>
				<h3>Play Nine</h3>
				<Stars 
					numberOfStars = {randomNumberOfStars}
				/>
				<Button 
					selectedNumbers={selectedNumbers}
					checkAnswer={this.checkAnswer}
					answerIsCorrect={answerIsCorrect}
					acceptAnswer={this.acceptAnswer}
					redraw={this.redraw}
					redraws={redraws}
				/>
				<Answer 
					selectedNumbers={selectedNumbers}
					unselectNumber={this.unselectNumber} 
				/>
				{doneStatus ? 
					<DoneFrame
						doneStatus={doneStatus} 
					/>
					: 
					<Numbers 
						selectedNumbers={selectedNumbers}
						selectNumber={this.selectNumber} 
						usedNumbers={usedNumbers}
					/>
				}
				
			</div>
		);
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<Game />
			</div>
		);
	}
}

ReactDOM.render(<App />, mountNode);

/*
 *	NUMBER SELECTION
 */
