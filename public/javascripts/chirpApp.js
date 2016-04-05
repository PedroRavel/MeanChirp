var app = angular.module('chirpApp',['ngRoute','ngResource']).run(function($rootScope,$http){
	$rootScope.autheticated = false;
	$rootScope.current_user = "";
	
	$rootScope.signout = function(){
		$rootScope.autheticated = false;
		$http.get('/auth/signout')
		
		$rootScope.current_user = "";
	}
});

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
});



/*
	var factory = {};
	factory.getAll = function(){
		return $http.get('/api/posts');
	}
	return factory;
*/

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

app.controller('mainController', function(postService, $scope, $rootScope){
	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	
	$scope.post = function() {
	  $scope.newPost.created_by = $rootScope.current_user;
	  $scope.newPost.created_at = Date.now();
	  postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
	    $scope.newPost = {created_by: '', text: '', created_at: ''};
	  });
	};
});

app.controller('authController', function($scope, $rootScope, $http, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){
	$http.post('/auth/login',$scope.user).success(function(data){
		$rootScope.authenticated = true;
		$rootScope.current_user = data.user.username;
		$location.path('/');
	})
	};

	$scope.register = function(){
	$http.post('/auth/signup',$scope.user).success(function(data){
		$rootScope.authenticated = true;
		$rootScope.current_user = data.user.username;
		$location.path('/');
	})
	};
});		