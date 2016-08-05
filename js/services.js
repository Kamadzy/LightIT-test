'use strict';

angular.module('Authentication',[])

    .factory('AuthenticationService',
    ['$http', '$cookieStore', '$rootScope', '$timeout',
        function ($http, $cookieStore, $rootScope, $timeout) {
            var service = {};

            service.Registration = function (username, password, callback) {
                $http.post('http://smktesting.herokuapp.com/api/register/',{ username: username, password: password })
                    .success(function (response) {
                        callback(response);
                    });

            };
            service.Login = function (username, password, callback) {
                $http.post('http://smktesting.herokuapp.com/api/login/', { username: username, password: password })
                    .success(function (response) {
                        callback(response);
                    });

            };

            service.SetCredentials = function (username, token) {
                $rootScope.globals = {

                    currentUser: {
                        username: username,
                        token: token

                    }
                };

                $http.defaults.headers.common['Authorization'] = 'Token' + token;
                $cookieStore.put('globals', $rootScope.globals);
            };

            service.ClearCredentials = function () {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
                /*$http.defaults.headers.common.Authorization = 'Token';*/
            };

            return service;
        }]);