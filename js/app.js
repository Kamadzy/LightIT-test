(function() {
  var app = angular.module('gemStore', ['store-directives', 'ngRoute','ngCookies','Authentication']);

  app.controller('StoreController', ['$http', function($http){
    var store = this;
    store.products = [];
    $http.get('http://smktesting.herokuapp.com/api/products').success(function(data){
        store.products = data;
    });
  }]);


  app.controller('ReviewController', function() {
    this.review = {};

    this.addReview = function(product) {
      product.reviews.push(this.review);

      this.review = {};
    };
  });


  app.controller('registrationController', ['$scope', '$rootScope', '$location', 'AuthenticationService',
        function ($scope, $rootScope, $location, AuthenticationService) {
          // reset login status
          AuthenticationService.ClearCredentials();

          $scope.registration = function () {
            $scope.dataLoading = true;
            AuthenticationService.Registration($scope.username, $scope.password, function (response) {
              if (response.success) {
                /*AuthenticationService.SetCredentials($scope.username, response.token);*/
                $location.path('/product-list');
              } else {
                $scope.dataLoading = false;
              }
            });
          };
        }]);


  app.controller('loginController', function(){

  });


  app.config(function($routeProvider) {
    $routeProvider
      .when("/", {
          controller: 'registrationController',
          templateUrl: "./templates/registration.html"
        })
        .when("/login", {
          controller: 'loginController',
          templateUrl: "./templates/login.html"
        })
        .when("/registration", {
          templateUrl: "./templates/registration.html"
        })
        .when("/product-list", {
          templateUrl: "./templates/product-list.html"

        })
        .otherwise({redirectTo: '/'});
  });
})();