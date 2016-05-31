(function () {
    'use strict';

    var rasputin = angular.module('rasputin', [
        'ngMessages',
        'ui.router',
        'ui.bootstrap',
        'LocalStorageModule',
        'ngOboe',
        'ngAnimate'
    ]);

    rasputin
        .config(
            ['$locationProvider', 'localStorageServiceProvider', '$urlRouterProvider', '$stateProvider', 
            function ($locationProvider, localStorageServiceProvider, $urlRouterProvider, $stateProvider) {
                $locationProvider.html5Mode(true);
                $locationProvider.hashPrefix('!');
                localStorageServiceProvider.setPrefix('rasputin');

                $urlRouterProvider.otherwise('/');

                var getUser = ['userService', '$rootScope', function (userService, $rootScope) { return userService.checkToken().then($rootScope.successHandler); }];

                $stateProvider
                    .state('home', {
                        url: '/',
                        templateUrl: 'templates/home.html',
                        controller: 'homeController as vm'
                    })
                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'loginController as vm'
                    })
                    .state('signup', {
                        url: '/signup',
                        templateUrl: 'templates/signup.html',
                        controller: 'signupController as vm'
                    })
                    .state('dashboard', {
                        url: '/dashboard',
                        templateUrl: 'templates/dashboard.html',
                        controller: 'dashboardController as vm',
                        resolve: {
                            User: getUser
                        }
                    })
        }])
        .factory('_', function($window) { return $window._; })
        .run(['$rootScope', function ($rootScope) {
            $rootScope.successHandler = function (res) { return res.data };
        }]);

})();
