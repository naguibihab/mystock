'use strict';

angular.module('myApp.mainview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'mainview/mainview.html',
    controller: 'mainviewCtrl'
  });
}])

.controller('mainviewCtrl', ['$scope','$firebaseArray','$firebaseObject','$http','$q',
	function($scope,$firebaseArray,$firebaseObject,$http,$q) {
	$scope.equity = [];

	var userRef = firebase.database().ref().child('user');
	var equitiesRef = firebase.database().ref().child('equities');
	$firebaseObject(userRef).$bindTo($scope,"user"); // $scope.user is threeway bound with HTML & Firebase

	$scope.buyShare = function(equityKey){
		$scope.user.funds -= $scope.equity[equityKey].data[1]; // share.data[1] is the Open column
		$scope.equity[equityKey].userShares++;
		updateEquity(equityKey,$scope.equity[equityKey].userShares);
	}

	$scope.sellShare = function(equityKey){
		$scope.user.funds += $scope.equity[equityKey].data[1]; // share.data[1] is the Open column
		$scope.equity[equityKey].userShares--;
		updateEquity(equityKey,$scope.equity[equityKey].userShares);
	}

	var updateEquity = function(equityId,shares){
		var thisEquity = $firebaseObject(equitiesRef.child(equityId));
		thisEquity.$loaded(
			function(data){
				thisEquity.userShares = shares;
				thisEquity.$save();
		});
	}

	var getStockData = function(page = 1){
		var deferred = $q.defer();
		var results = [];
		// Step 1 get the equities that we have in the database
		var equitiesQuery = equitiesRef.orderByChild("id").startAt(0).endAt(5);
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
		console.log('getStockDataBySymbol called',equity[atSymbolIndex],atSymbolIndex,limit);
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'https://www.quandl.com/api/v3/datasets/WIKI/'+equity[atSymbolIndex].symbol+'.json?limit=1&&api_key='+__env.quandl.apikey
		}).then(function successCallback(response){
			$scope.equity.push(
				{
					id: equity[atSymbolIndex].id,
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