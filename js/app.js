(function() {
  var app = angular.module('productStore', ['store-directives', 'ngRoute','ngCookies','Authentication']);

  app.controller('StoreController', ['$http','AuthenticationService', function($http,  AuthenticationService){
    var store = this;
    store.products = [];
    $http.get('http://smktesting.herokuapp.com/api/products').success(function(data){
        store.products = data;

      angular.forEach(store.products, function(value, key) {
        $http.get('http://smktesting.herokuapp.com/api/reviews/' + value.id)
            .success(function(response){
              store.products[key].reviews = response;

            });
      });

    });
  }]);


  app.controller('ReviewController', ["$scope","AuthenticationService",function($scope, AuthenticationService) {
    this.review = {};
    this.rate = "";
    this.text = "";

    this.addReview = function(product) {

      AuthenticationService.SubmitReview(product.id, this.rate, this.text, function(response){
          if(response.success){

          }else{
            product.reviews = response;
          }
      });

    };

  }]);


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