if ( typeof cwfm == 'undefined' ) var cwfm  =  {};

cwfm.user = {};

cwfm.user.service  =  function() {
	var user      = {};
	var listeners = [];
	return {
		change: function (callback) {
			listeners.push(callback);
		}
		, get: function () {
			return user;
		}
		, set: function (data) {
			user = typeof(data) == 'object' ? data : {};
			angular.forEach(listeners, function(listener) {
				listener(user);
			});
		}
	}
};

cwfm.user.ctrl  =  function( $scope, $http, $user ) {

	var init  =  function( ) {
		$scope.user  = $user.get();
		$scope.error = null;
		$scope.load_me();
	};

	var set_user = function(rsp) {
		$user.set(rsp);
		$scope.user = $user.get();
	};

	var oops  =  function(e) {
		console.info(e);
		$scope.error = e.error;
	};

	$scope.load_me  =  function() {
		$http.get('/user/me')
			.success(set_user)
			.error(oops);
	};

	$scope.create_user  =  function( ) {
		$http.post('/user/create', $scope.new_user)
			.success(set_user)
			.error(oops);
	}

	$scope.login  =  function( ) {
		$http.post('/user/login', $scope.user)
			.success(set_user)
			.error(oops);
	};

	$scope.logout  =  function( ) {
		$http.post('/user/logout', {})
			.success(set_user)
			.error(oops);
	}

	init( );
};
