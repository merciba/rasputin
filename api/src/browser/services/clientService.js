(function() {
    'use strict';

    angular.module('rasputin').factory('clientService',
        ['$rootScope', '$http', '$window', 'localStorageService',
        function($rootScope, $http, $window, localStorageService) {

        function getClients () { return $http.get('/api/client').then($rootScope.successHandler) ; }

        return {
        	getClients: getClients
        }
    }]);
})();