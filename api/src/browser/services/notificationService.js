(function() {
    'use strict';

    angular.module('rasputin').factory('notificationService',
        ['$rootScope', '$http', '$window', 'localStorageService',
        function($rootScope, $http, $window, localStorageService) {
        if ($window.toastr) $window.toastr.options.preventDuplicates = true;

        return {
            success: $window.toastr.success,
            error: $window.toastr.error,
            httpRequestError: function (error) {
                if (error.data) $window.toastr.error(error.data);
                else if (error.message) $window.toastr.error(error.message);
                else $window.toastr.error("Internal Server Error"); 
            }
        }
    }]);
})();