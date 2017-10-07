// counter example
function counter(state, action) {
	if (typeof state === 'undefined') { // if reducer receives undefined, must return what is considered the "initial state"
		return 0;
	}

	if (action.type === 'INCREMENT') {
		return state + 1;
	}
	else if (action.type === 'DECREMENT') {
		return state - 1;
	}
	else {
		return state; // if action dispatched not understood, return current state of app
	}
}


// counter example with cosmetic tweaks
const counter(state = 0, action) => {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		case 'DECREMENT':
			return state - 1;
		default:
			return state;
	}
};

const { createStore } = Redux; // ES6 syntax, look this up!!!
// var createStore = Redux.createStore; // same
// import { createStore } from 'redux'; // same
const store = createStore(counter); // counter = the reducer which manages state updates

const render = () => {
	document.body.innerText = store.getState();
};

store.dispatch({ type: 'INCREMENT' });
store.subscribe(render);
render();

document.addEventListener('click', () => {
	store.dispatch({ type: 'INCREMENT' });
});
// --------------------


// implement createStore from scratch
const createStore = (reducer) => {
	let state;
	let listeners = [];

	const getState = () => state;

	const dispatch = (action) => {
		state = reducer(state, action);
		listeners.forEach(listener => listener());
	};

	const subscribe = (listener) => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter(l => l !== listener); // calling it twice unsubscribes???
		};
	};

	dispatch({}); // populate initial state???

	return { getState, dispatch, subscribe };
}
// --------------------


// with react
...
const Counter = ({value, onIncrement, onDecrement}) = (
	<div>
		<h1>{value}</h1>
		<button onClick={onIncrement}>+</button>
		<button onClick={onDecrement}>-</button>
	</div>
);

const render = () => {
	ReactDOM.render(
		<Counter value={store.getState()} 
		onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
		onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
		/>,
		document.getElemtnById('root')
	);
};
...


/// correcting sublime syntax highlighting 
// array of counters example
const addCounter = (list) => {
	return [...list, 0];
};

const removeCounter = (list, index) => {
	return [
		...list.slice(0, index),
		...list.slice(index + 1)
	];
};

const incrementCounter = (list, index) => {
	return [
		...list.slice(0, index),
		...list[index] + 1,
		...list.slice(index + 1)
	];
};
// --------------------

// todo example
const toggleTodo = (todo) => {
	return Object.assign({}, todo, {	// look this up!!!
		completed: !todo.completed
	});
};


// reducer for todos
const todos = (state = [], action) => {
	switch(action.type) {
		case 'ADD_TODO':
			return [
				...state,
				{ 
					id: action.id,
					text: action.text,
					completed: false
				}
			]
		case 'TOGGLE_TODO':
			return state.map(todo => {
				if (todo.id !== action.id) {
					return todo;
				} 
				return {
					...todo,
					completed: !todo.completed
				};
			});
		default:
			return state;
	}
};

// more readable
// reducer composition
// single top-level reducer with other reducers???
const todo = (state, action) => { // handles a single todo
	switch (action.type) {
		case 'ADD_TODO':
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case 'TOGGLE_TODO':
			if (state.id !== action.id) {
				return state;
			}
			return {
				...state,
				completed: !state.completed
			};
		default:
			return state;
	}
}

const todos = (state = [], action) => { 
	switch(action.type) {
		case 'ADD_TODO':
			return [
				...state,
				todo(undefined, action); // how does this work???
			]
		case 'TOGGLE_TODO':
			return state.map(t => todo(t, action));
		default:
			return state;
	}
};