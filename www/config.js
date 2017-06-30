angular.module("automator")
    .config(function($mdGestureProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $mdGestureProvider.skipClickHijack();

        window.stateProviderRef = $stateProvider;

        $stateProvider

            .state('app', {
            url: '/app',
            templateUrl: 'templates/app.html',
            abstract: true
        })

        .state('init', {
            url: '/init',
            templateUrl: 'templates/init.html',
            controller: function($http, $scope, $app) {
                $scope.fetch = function() {
                    $scope.error = false
                    $http.get("https://thebuilder.hk/automator/mobile/100026/json").then(function(response) {
                        if (response.status <= 400 && response.status != -1) {
                            console.log(response.data);
                            $app.prepare(response.data);
                        } else {
                            $scope.error = true
                        }
                    })

                }
                // $scope.error = true;
                $scope.fetch();
            }
        })

        .state('app.tab', {
            url: '/tab',
            abstract: true,
            views: {
                "app": {
                    templateUrl: 'templates/tabs.html'
                }
            }
        })
        $urlRouterProvider.otherwise("/init");
    })
