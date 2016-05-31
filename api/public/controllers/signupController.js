(function() {
    'use strict';

    angular.module('rasputin').controller('signupController',
        ['$window', '$state', '$scope', 'userService', 'localStorageService', 'notificationService',
        function($window, $state, $scope, userService, localStorageService, notificationService) {
        var vm = this;

        vm.signupForm = {};

        vm.signup = function () {
        	if (vm.signupForm.password === vm.signupForm.confirmPassword) {
        		delete vm.signupForm.confirmPassword;
        		userService.signup(vm.signupForm)
        			.then(function (res) {
        				localStorageService.set('token', res.token);
        				$state.go('dashboard');
        			}, notificationService.error);
        	}
        };
    }]);
})();