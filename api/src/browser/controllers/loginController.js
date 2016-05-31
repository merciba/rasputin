(function() {
    'use strict';

    angular.module('rasputin').controller('loginController',
        ['$window', '$state', '$scope', 'userService', 'localStorageService', 'notificationService',
        function($window, $state, $scope, userService, localStorageService, notificationService) {
        var vm = this;

        vm.loginForm = {};

        vm.login = function () {
        	userService.login(vm.loginForm)
    			.then(function (res) {
    				localStorageService.set('token', res.token);
    				$state.go('dashboard');
    			}, notificationService.error);
    	};
    }]);
})();