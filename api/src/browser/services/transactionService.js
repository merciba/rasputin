(function() {
    'use strict';

    angular.module('rasputin').factory('transactionService',
        ['$rootScope', '$http', '$window', 'localStorageService',
        function($rootScope, $http, $window, localStorageService) {

        var getTransactions = function () {
        	return $http.get("/api/transaction").then($rootScope.successHandler);
        };

        return {
        	getTransactions: getTransactions
        }
    }]);
})();