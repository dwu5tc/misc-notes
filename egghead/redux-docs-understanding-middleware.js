// jshint ignore: start

function logger(store) {
	let next = store.dispatch
	return function dispatchAndLog(action) {
		console.log('dispatching', action)
		let result = next(action)
		console.log('next state', store.getState())
		return result
	}
}

function applyMiddlewareByMonkeypatching(store, middlewares) {
	middlewares = middlewares.slice()
	middlewares.reverse()
	// transform dispatch function with each middleware
	middlewares.forEach(middleware =>
		store.dispatch = middleware(store)
	)
}
// --------------------


// better way of chaining middlewares
// accept the next() dispatch function as a parameter instead of reading it from the store instance
function logger(store) {
	return function wrapDispatchToAddLogging(next) {
		return function dispatchAndLog(action) {
			console.log('dispatching', action)
			let result = next(action)
			console.log('next state', store.getState())
			return result
		}
	}
}

// with es6
const logger = store => next => action => {
	console.log('dispatching', action)
	let result = next(action)
	console.log('next state', store.getState())
	return result
}

const logger = store => next => 
	return function(action) = {
	console.log('dispatching', action)
	let result = next(action)
	console.log('next state', store.getState())
	return result
}


const crashReporter = store => next => action => {
	try {
		return next(action)
	} catch (err) {
		console.error('Caught an exception!', err)
		Raven.captureException(err, {
			extra: {
				action,
				state: store.getState()
			}
		})
		throw err
	}
}

// naive implementation of applying middleware
function applyMiddleware(store, middlewares) {
	middlewares = middlewares.slice()
	middlewares.reverse()
	let dispatch = store.dispatch
	middlewares.forEach(middleware =>
		dispatch = middleware(store)(dispatch)
	)
	return Object.assign({}, store, { dispatch })
}
// --------------------

