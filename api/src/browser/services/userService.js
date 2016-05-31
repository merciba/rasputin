(function() {
    'use strict';

    angular.module('rasputin').factory('userService',
        ['$rootScope', '$http', '$window', 'localStorageService',
        function($rootScope, $http, $window, localStorageService) {

        var checkToken = function () {
            $http.defaults.headers.common['Authorization'] = localStorageService.get('token');
            return $http.post('/api/token/authenticate').then($rootScope.successHandler);
        };
        
        var signup = function (data) {
            return $http.post('/api/signup', data).then($rootScope.successHandler);
        };

        var login = function (data) {
            return $http.post('/api/login', data).then($rootScope.successHandler);
        };

        return {
            checkToken: checkToken,
            signup: signup,
            login: login
        }
    }]);
})();