(function() {
    'use strict';

    angular.module('rasputin').factory('invoiceService',
        ['$rootScope', '$http', '$window', 'localStorageService',
        function($rootScope, $http, $window, localStorageService) {

        function getInvoices () { return $http.get('/api/invoice').then($rootScope.successHandler); }

        return {
        	getInvoices: getInvoices
        }
    }]);
})();