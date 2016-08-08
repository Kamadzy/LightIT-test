'use strict';

angular.module('Authentication',[])

    .factory('AuthenticationService',
    ['$http', '$cookieStore', '$rootScope', '$timeout',
        function ($http, $cookieStore, $rootScope, $timeout) {
            var service = {};
            var reviews = {};

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

                $http.defaults.headers.common['Authorization'] = 'Token ' + token;
                $cookieStore.put('globals', $rootScope.globals);
            };

            service.SubmitReview = function (id_product,rate, text, callback){
                $http.post('http://smktesting.herokuapp.com/api/reviews/' + id_product, {rate:rate ,text:text})
                    .success(function(){
                       service.GetAllReview(id_product, callback);

                    });

            };

            service.GetAllReview = function(id_product, callback){
                $http.get('http://smktesting.herokuapp.com/api/reviews/' + id_product)
                    .success(function(response){
                        reviews[id_product] = response;

                        console.log(response);
                        callback(response);

                    });

                return reviews[id_product];
            };


            service.ClearCredentials = function () {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
                /*$http.defaults.headers.common.Authorization = 'Token';*/
            };

            return service;
        }]);