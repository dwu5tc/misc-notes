/* --------------------
   INTRODUCTION
   -------------------- */

module.exports = {
	entry: './app.js',
	output: {
		filename: 'bundle.js'
	},
	watch: true // or webpack --watch
};

// npm install webpack-dev-server -g

// webpack-dev-server --inline 
// localhost:8080 with hot reloading without status bar
// defaults to index.html

module.exports = {
	// no natural place to add in utils.js with module system
	// but still want it in bundle
	entry: ['./utils.js', './app.js'],
	output: {
		filename: 'bundle.js'
	},
	watch: true, // or webpack --watch
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				exclude: 'node_modules',
				loader: 'jshint-loader'
			}
		],
		loaders: [ // array of loaders each of which = an obj
			{
				test: /\.es6$/, // regex that test what kind of files to run through this loader
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	// section that lets us specify what file types we can 
	// process without specifically giving them a file extension
	// e.g `require('.login')` instead of `require('.login.es6')`
	resolve: {
		extensions: ['', '.js', '.es6']
	}
};

// package.json
/* ... 
	"scripts": {
		"start": "webpack-dev-server"
	}
	... */

// development vs production

// npm install strip-loader --save-dev
// new config file for production = webpack-production.config.js
// acts as an EXTENSION ontop of webpack.config.js

var WebpackStrip = require('strip-loader');
var devConfig = require('./webpack.config.js');

var stripLoader = {
	test: [/\.js$/, /\.es6$/],
	exclude: /node_modules/,
	loader: WebpackStrip.loader('console.log')
};

devConfig.module.loaders.push(stripLoader);

module.exports = devConfig;
// webpack --config webpack-production.config.js -p
// -p flag minifies code

// npm install http-server -g
// http-server

/* --------------------
   ADVANCED
   -------------------- */

// with added folder structure
/* folder structure
js/
	app.js
	login.es6
	utils.js
node_modules/
public/
	index.html
package.json
webpack.config.js
*/
var path = require('path');

module.exports = {
	context: path.resolve('js'), // sets a relative root directory for the entry key
	// will now look for utils and app inside ./js directory
	entry: ['utils.js', './app'],
	output: { // any requests for public/assets/js will actually be served out of build/js
		path: path.resolve('build/js/'),
		publicPath: '/public/assets/js/',
		filename: 'bundle.js'
	},
	devServer: {
		contentBase : 'public' // any requests from root will come out of public
	},
	module: {
		loaders: [
			{
				test: /\.es6$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.es6']
	}
};
// effect of using dev web server like this:
// bundle file itself not actually produced onto disk
// served virtually by the web server
// wont see build folder get created and wont see bundle file inside
// if running webpack from command line you will though

// using es6 synax
// login.es6
let login = (username, password) => {
	// code here
};
export { login };

// app.es6
import { login } from '.login';
login('admin', 'foo');

// source maps
// webpack -d
// webpack-dev-server -d

// creating multiple bundles
/* folder structure
js/
	about_page.js
	contact_page.js
	home_page.js
node_modules/
public/
	about.html
	contact.html
	index.html
package.json
webpack.config.js
*/

// each of the html files points to a share.js and its own .js file

var path = require('path');
var webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPLugin('shared.js');

module.exports = {
	context: path.resolve('js'),
	entry: {
		about: './about_page.js',
		home: './home_page.js',
		contact: './contact_page.js'
	},
	output: {
		path: path.resolve('build/js/'),
		publicPath: '/public/assets/js',
		filename: '[name].js' // will make name of output file match key in entry the object
	},
	plugins: [commonsPlugin],
	devServer: {
		contentBase: 'public'
	},
	module: {
		loaders: [
			{
				test: /\.es6$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.es6']
	}
};

/* --------------------
   ADDING CSS IMAGES AND FONTS
   -------------------- */

// npm install css-loader style-loader --save-dev
var path = require('path');

module.exports = {
	context: path.resolve('js'),
	entry: ['utils.js', './app'],
	output: {
		path: path.resolve('build/js/'),
		publicPath: '/public/assets/js/',
		filename: 'bundle.js'
	},

	devServer: {
		contentBase : 'public'
	},

	module: {
		loaders: [
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: 'style-loader!css-loader'
			}
		]
	},

	resolve: {
		extensions: ['', '.js', '.es6']
	}
};

// app.js
require('../css/bootstrap.css');
require('../css/app.css');

// using SASS
// npm install sass-loader --save-dev
var path = require('path');

module.exports = {
	context: path.resolve('js'),
	entry: ['utils.js', './app'],
	output: {
		path: path.resolve('build/js/'),
		publicPath: '/public/assets/js/',
		filename: 'bundle.js'
	},

	devServer: {
		contentBase : 'public'
	},

	module: {
		loaders: [
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loader: 'style-loader!css-loader!sass-loader' // actually runs in reverse (starting with sass)???
			}
		]
	},

	resolve: {
		extensions: ['', '.js', '.es6']
	}
};

// separate css file
// npm install extract-text-webpack-plugin --save-dev
// must add link to css file in index.html now
var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	context: path.resolve('js'),
	entry: ['utils.js', './app'],
	output: {
		path: path.resolve('build/'),
		publicPath: '/public/assets/',
		filename: 'bundle.js'
	},
	plugins: [
		new ExtractTextPlugin('styles.css')
	],

	devServer: {
		contentBase : 'public'
	},

	module: {
		loaders: [
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
			}
		]
	},

	resolve: {
		extensions: ['', '.js', '.es6']
	}
};

// auto-prefixer
// npm install auto-prefixer-loader --save-dev
// add it before the css-loader
{
	loader: 'style-loader!css-loader!auto-prefixer-loader!scss-loader'
}

// adding images
// url-loader
{
	test: /\.(png|jpg)$/,
	exclude: /node_modules/,
	loader: 'url-loader?limit=100000' // size-limit parameter
}
// images < than the limit will inlined and turned into base64 encoded data
// bigger images will be a separate image and separate request
// typically 8-10kb
// what does "inlined" mean???

// adding fonts
{
	test: /\.(png|jpg|ttf|eot)$/
	exclude: /node_modules/,
	loader: 'url-loader?limit=8192' // size-limit parameter
}

// app.css
// somehow can use `src: url('../fonts/Some-Font-Regular.ttf');`???

/* --------------------
   WEBPACK TOOLS
   -------------------- */

// connect middleware
// used with a node webserver (connect or express)
// watches files and serves them up
// similar to webpack-dev-server except more fully featured and complex

// server.js
var express = require('express');
var path = require('path');
var logger = require('morgan');
var routes = require('./routes/index');

var app = express();

// setting up the view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use('/', routes);

// ***only load this middleware in dev mode!!!
if (app.get('env') === 'development') {
	var webpackMiddleware = require('webpack-dev-middleware');
	var webpack = require('webpack');

	var config = require('./webpack.config');

	app.use(webpackMiddleware(webpack(config), {
		publicPath: '/build', // ***necessary
		// overrides whats in webpack.config.js (the public path)
		// specifies where the webpack MW will be serving up the bundle file

		headers: { 'X-Custom-Webpack-Header': 'yes' },

		stats: {
			colors: true
		}
	}));

	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	var server = app.listen(8000, function() {
		console.log('Listening on port 8080');
	});
}

// routes/index.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, ext) {
	res.render('index', { title: 'Express App' });
});

module.exports = router;

// creating a custom loader
// strips comments in JSON
// webpack.config.js
{
	loaders: {
		test: /\.json$/,
		exclude: /node_modules/,
		loader: 'json-loader!' + path.resolve('loaders/strip')
	}
}

// loaders/strip.js
var stripComments = require('strip-json-comments');

module.exports = function(source) {
	this.cacheable(); // ***include this if possible
	// lets webpack know that this loader is cacheable/deterministic
	// given same inputs, will produce same outputs
	// wouldn't do this for something like a RNG based on clock
	// more performant 
	return stripComments(source);
}

// plugins
// timestamp-webpack-plugin installed as a dev dependency
// jquery installed as a dependancy
// webpack.config.js
var webpack = require('webpack');
var TimestampWebpackPlugin = require('timestamp-webpack-plugin');
{
	// make jquery accessible to all files processed by webpack
	plugins: [
		new webpack.ProvidePlugin({ // provides global variables
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),

		new TimestampWebpackPlugin({
			path: __dirname,
			filename: 'timestamp.json'
		}),

		new webpack.BannerPlugin('*****\nGenerated by Webpack\n*****\n')
	]
}

/* --------------------
   WITH REACT
   -------------------- */

// install babel-preset-react
// .babelrc
{
	'presets': ['es2015', 'react']
}

// webpack.config.js
{
	loaders: [
		test: /\.(es6|js)$/, // both es6 and js
		exclude: /node_modules/,
		loader: 'babel-loader'
	]
}

/* --------------------
   WITH ANGULARJS
   -------------------- */
// module system helps avoid globals
// angular uses globals
var angular = require('angular');
var app = angular.module('app', []);

// ***WATCH THE REST...




