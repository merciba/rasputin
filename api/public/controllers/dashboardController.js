(function() {
    'use strict';

    angular.module('rasputin').controller('dashboardController',
        ['$rootScope', '$http', '$q', '_', '$window', '$state', '$scope', 'transactionService', 'clientService', 'invoiceService', 'notificationService',
        function($rootScope, $http, $q, _, $window, $state, $scope, transactionService, clientService, invoiceService, notificationService) {
        
        var vm = this;

        vm.plaidStatus = false;
        vm.freshbooksStatus = false;

        vm.transactions = [];
        vm.clients = [];
        vm.invoices = [];
        vm.accounts = [];
        vm.getAccountName = function (id) {
            return _.find(vm.accounts, { _id: id }).meta.official_name;
        };

        $('#bank-login').show();

        $http.get("/api/dashboard")
        	.then($rootScope.successHandler, notificationService.httpRequestError)
        	.then(function (dashboard) {
        		vm.bankStatus = dashboard.plaidStatus;
        		vm.freshBooksStatus = dashboard.freshBooksStatus;
        		var promises = [];
        		if (vm.bankStatus) transactionService.getTransactions().then(function (results) { 
                    vm.transactions = results.transactions; 
                    vm.accounts = results.accounts;
                    $('#bank-login').hide();
                });
        		if (vm.freshBooksStatus) {
        			clientService.getClients().then(function (clients) { vm.clients = clients; });
        			invoiceService.getInvoices().then(function (invoices) { vm.invoices = invoices; });
        		}
        	}, notificationService.httpRequestError);
    }]);
})();