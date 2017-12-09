'use strict';

// Import environment variables
var env = {};
if(window){
	Object.assign(env, window.__env);
}

function disableLogging($logProvider, __env){  
  $logProvider.debugEnabled(__env.enableDebug);
}

// Inject dependencies
disableLogging.$inject = ['$logProvider', '__env'];

// Declare app level module which depends on views, and components
angular.module('myApp', [
	'ngRoute',
	'myApp.mainview',
	'myApp.version',

	'firebase'
])
.constant('__env', env)
.config(disableLogging)
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider.otherwise({redirectTo: '/main'});

	// Initialise Firebase
	firebase.initializeApp(__env.firebase);
}]); 
