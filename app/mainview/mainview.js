'use strict';

angular.module('myApp.mainview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'mainview/mainview.html',
    controller: 'mainviewCtrl'
  });
}])

.controller('mainviewCtrl', ['$scope','$firebaseArray','$http',
	function($scope,$firebaseArray,$http) {
	// Step 1 get the equities that we have in the database
	var equitiesRef = firebase.database().ref('equities');
	var equities = $firebaseArray(equitiesRef);
	equities.$loaded(
		function(data){
			// Step 2 call Alpha Vantage API to get the latest info for each symbol
			angular.forEach(data,function(equity){
				console.log('iterating on',equity)
				$http({
					method: 'GET',
					url: 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=compact&interval=1min&symbol='+equity.$value+'&apikey='+__env.aphavintage
				}).then(function successCallback(response){
					console.log('alpha vantage response',response,response.data);
				}, function errorCallback(response){
					console.error('An issue happened when contacting Alpha Vantage',response);
				});
			});
	});

}]);