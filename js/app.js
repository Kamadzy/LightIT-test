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

          $scope.dataLoading = false;
          $scope.errorMessage = '';
          AuthenticationService.ClearCredentials();

          $scope.registration = function () {
            $scope.dataLoading = false;
            AuthenticationService.Registration($scope.username, $scope.password, function (response) {
              if (response.success) {
                AuthenticationService.SetCredentials($scope.username, response.token);
                $location.path('/product-list');
              } else {
                $scope.dataLoading = true;
                $scope.errorMessage = response.message;
              }
            });
          };
          $scope.goToLogin = function(){
            $location.path('/login');
          }
        }]);


  app.controller('loginController', ['$scope', '$rootScope', '$location','AuthenticationService',
      function($scope, $rootScope, $location, AuthenticationService){

        $scope.dataLoading = false;
        $scope.errorMessage = '';
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
          $scope.dataLoading = false;
          AuthenticationService.Login($scope.username, $scope.password, function (response) {
            if (response.success) {
              AuthenticationService.SetCredentials($scope.username, response.token);
              $location.path('/product-list');
            } else {
              $scope.dataLoading = true;
              $scope.errorMessage = response.message;
            }
          });
        };

  }]);


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