'use strict';

angular.module('myApp.mainview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'mainview/mainview.html',
    controller: 'mainviewCtrl'
  });
}])

.controller('mainviewCtrl', ['$scope','$firebaseArray','$http','$q',
	function($scope,$firebaseArray,$http,$q) {

	var getStockData = function(page = 1){
		var deferred = $q.defer();
		var results = [];
		// Step 1 get the equities that we have in the database
		var equitiesRef = firebase.database().ref().child('equities');
		var equitiesQuery = equitiesRef.orderByChild("id").startAt(1).endAt(6);
		var equities = $firebaseArray(equitiesQuery);
		equities.$loaded(
			function(data){
				// Step 2 call Alpha Vantage API to get the latest info for each symbol
				angular.forEach(data,function(equity){
					console.log('iterating on',equity)
					$http({
						method: 'GET',
						url: 'https://www.quandl.com/api/v3/datasets/WIKI/'+equity.symbol+'.json?limit=1&&api_key='+__env.quandl.apikey
					}).then(function successCallback(response){
						console.log('alpha vantage response',response,response.data.dataset.data[0]);
					}, function errorCallback(response){
						console.error('An issue happened when contacting Alpha Vantage',response);
					});

				});
		});

		return deferred.promise;
	}

	getStockData();

}]);