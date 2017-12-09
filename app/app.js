'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.mainview',
  'myApp.version',

  'firebase'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/main'});

  // Initialise Firebase
  var config = {
    apiKey: "AIzaSyCrjNulatMucABMGQvAc5bg8D35GU-eO3o",
    authDomain: "mystock-34b49.firebaseapp.com",
    databaseURL: "https://mystock-34b49.firebaseio.com",
    projectId: "mystock-34b49",
    storageBucket: "",
    messagingSenderId: "925777963088"
  };
  firebase.initializeApp(config);
}]);
