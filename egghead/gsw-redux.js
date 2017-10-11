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
const counter(state = 0, action) => { // if state === undefined, state = 0 (ES6 default param vals) 
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		case 'DECREMENT':
			return state - 1;
		default:
			return state;
	}
};

const { createStore } = Redux; // (ES6 ???!!!)
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
			listeners = listeners.filter(l => l !== listener); // calling it twice unsubscribes
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


// correcting sublime syntax highlighting 
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
	return Object.assign({}, todo, {	// assigning of enumerable (shallow copies) props into {} (ES6 obj prop assignment)
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

// visibility filter
const visibilityFilter = (state = 'SHOW_ALL', action) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return aciton.filter;
		default: 
			return state;
	}
};

// initially, undef will be passed as states to the child reducers (state = {})
// child reducers will return their initial states
const todoApp = (state = {}, action) => {
	return {
		todos: todos( // can be written like this or like below
			state.todos,
			action
		),
		visibilityFilter: visibilityFilter(state.visibilityFilter, action)
	};
};
// is this the top-level reducer??? yes

// same as below
const { combineReducers } = Redux;
const todoApp = combineReducers({
	todos, // always name reducers after the state keys they manage --> convention (can leverage ES6 obj prop shorthand)
	visibilityFilter
});

...
const { createStore } = Redux;
const store = createStore(todoApp);
...
// --------------------


// implementing combineReducers from scratch
const combineReducers = (reducers) => { // 
	return (state = {}, action) => {
		return Object.keys(reducers).reduce(
			(nextState, key) => { // nextState = cumulative value, key = elem value
				nextState[key] = reducers[key](
					state[key], // e.g nextState[todos] = reducers[todos](state.todos, action)
					action
					);
				return nextState;
			},
			{}
		); // end of reduce func
	};
};


// implementation of view layer
const { Component } = React;

const FilterLink = ({ filter, currentFilter, children }) => { // children!!!???
	if (filter === currentFilter) {
		return <span>{children}</span>; // not clickable
	}

	return (
		<a href='#'
		onClick={ e => {
			e.preventDefault();
			store.dispatch({
				type: 'SET_VISIBILITY_FILTER',
				filter
			});
		}}>
			{children}
		</a>
	);
};

const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_COMPLETED':
			return todos.filter(t => t.completed);
		case 'SHOW_ACTIVE':
			return todos.filter(t => !t.completed);
	}
};

let nextTodoId = 0; 

class TodoApp extends Component {
	render() {
		const { // (ES6 destructuring assignment)
			todos,
			visibilityFilter
		} = this.props 
		const visibleTodos = getVisibleTodos(todos, visibilityFilter);
		return (
			<div>
				<input ref={node => // wtf!!!???
					this.input = node;
				}} />
				<button onClick={() => {
					store.dispatch({
						type: 'ADD_TODO',
						text: this.input.value, // wtf!!!???
						id: nextTodoId++
					});
					this.input.value ='';// wtf!!!???
				}}>
				Add Todo 
				</button> 
				<ul>
					{visibleTodos.map(todo => 
						<li key={todo.id}
							onClick={() => {
								store.dispatch({
									type: 'TOGGLE_TODO',
									id: todo.id
								});
							}}
							style={{
								textDecoration: todo.completed ? 'line-through' : 'none'
							}}>
							{todo.text}
						</li>
					)}
				</ul>
				<p> 
					Show:
					{' '}
					<FilterLink
						filter='SHOW_ALL'
						currentFilter={visibilityFilter}
					>All
					</FilterLink>
					{' '}
					<FilterLink
						filter='SHOW_ACTIVE'
						currentFilter={visibilityFilter}
					>Active
					</FilterLink>
					{' '}
					<FilterLink
						filter='SHOW_COMPLETED'
						currentFilter={visibilityFilter}
					>Completed
					</FilterLink>
				</p>
			</div>
		);
	}
}

const render = () => { // reads current state of the store and passes the todos array to the TodoApp component as a prop
	reactDOM.render( // render called on every store change so todos prop = always up to date
		<TodoApp 
			// todos={store.getState().todos},
			// visibilityFilter={store.getState().visibilityFilter}
			{...store.getState()} // better (ES6 spread)
		/>,
		document.getElementById('root');
	)
}

store.subscribe(render);
render();
// --------------------

// ***REVIEW DATA FLOW --> 21. Extracting Presentation Components (AddTodo, Footer, FilterLink) -- 4:10
// https://egghead.io/lessons/react-redux-extracting-presentational-components-addtodo-footer-filterlink

const { store } = props // how does this work???!!!