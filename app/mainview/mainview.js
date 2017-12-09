'use strict';

angular.module('myApp.mainview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'mainview/mainview.html',
    controller: 'mainviewCtrl'
  });
}])

.controller('mainviewCtrl', ['$scope','$firebaseArray','$firebaseObject','$http','$q','$timeout',
	function($scope,$firebaseArray,$firebaseObject,$http,$q,$timeout) {
	$scope.equity = [];
	$scope.equityOnPage = [];

	var userRef = firebase.database().ref().child('user');
	var equitiesRef = firebase.database().ref().child('equities');
	var equitiesQuery = equitiesRef.orderByChild("id").startAt(0).endAt(5);
	$firebaseObject(userRef).$bindTo($scope,"user"); // $scope.user is threeway bound with HTML & Firebase
	// Get the equities that we have in the database
	$scope.equity = $firebaseArray(equitiesQuery);
	// $scope.pages = [];

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

	var getStockData = function(equity,page = 1){
		// Call the API to get the latest info for each symbol
		getStockDataBySymbol(equity,0,4).then(function(results){
			console.log('results',$scope.equity);
			$timeout(getStockData(equity,page),5000); // The function gets called every 5 seconds
		});
	};

	var getStockDataBySymbol = function(equity,atSymbolIndex,limit){
		console.log('getStockDataBySymbol called',equity[atSymbolIndex],atSymbolIndex,limit);
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'https://www.quandl.com/api/v3/datasets/WIKI/'+equity[atSymbolIndex].symbol+'.json?limit=1&&api_key='+__env.quandl.apikey
		}).then(function successCallback(response){
			$scope.equityOnPage[equity[atSymbolIndex].id]=
				{
					id: equity[atSymbolIndex].id,
					symbol: equity[atSymbolIndex].symbol,
					name: response.data.dataset.name,
					data: response.data.dataset.data[0],
					userShares: equity[atSymbolIndex].userShares || 0
				};
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

	// Once equities have been loaded off firebase
	$scope.equity.$loaded(function(data){
		getStockData($scope.equity);
		// $scope.pages=Math.ceil($scope.equity.length/5);
		// $scope.currentPage = 0;
	});
}]);