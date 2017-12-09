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
	$scope.equity = []

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
				getStockDataBySymbol(data,0,4).then(function(results){
					console.log('results',$scope.equity);
				});
		});

		return deferred.promise;
	};

	var getStockDataBySymbol = function(equity,atSymbolIndex,limit){
		console.log('getStockDataBySymbol called',equity,atSymbolIndex,limit);
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'https://www.quandl.com/api/v3/datasets/WIKI/'+equity[atSymbolIndex].symbol+'.json?limit=1&&api_key='+__env.quandl.apikey
		}).then(function successCallback(response){
			$scope.equity.push(
				{
					symbol: equity[atSymbolIndex].symbol,
					name: response.data.dataset.name,
					data: response.data.dataset.data[0],
					userShares: equity[atSymbolIndex].userShares || 0
				});
			console.log('alpha vantage response',response,response.data.dataset.data[0]);
			if(atSymbolIndex == limit){
				deferred.resolve();
			} else {
				getStockDataBySymbol(equity,atSymbolIndex+1,limit).then(function(subFunctionResult){
					deferred.resolve();
				});
			}
		}, function errorCallback(response){
			console.error('An issue happened when contacting Alpha Vantage',response);
		});

		return deferred.promise;
	};

	getStockData();
}]);