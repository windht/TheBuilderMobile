angular.module('automator', ['ionic', 'ngMaterial','oc.lazyLoad','ngMap']);

angular.module("automator")
    .config(function($mdGestureProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $mdGestureProvider.skipClickHijack();

        window.stateProviderRef = $stateProvider;

        $stateProvider



        .state('init', {
            url: '/init',
            template: `
            <div layout="column" layout-align="center center">
                <p style="margin:0">This app relies on online environment</p>
                <h2>The App Is Loading</h2>
                <div ng-show="error">
                    <p style="color:red">Network error, try to reload</p>
                    <md-button class="md-raised md-primary" ng-click="fetch()" style="margin:0;width:100%">Reload</md-button>
                </div>
                
            </div>
            `,
            controller: InitController
        })

        $urlRouterProvider.otherwise("/init");
    })

    
.factory("$app", function($http, $rootScope) {
    return {
        prepare: prepare,
        loadScript: loadScript
    }

    function prepare(app) {
        window.App = app;


        window.App.states.forEach(function(state) {
            if (!state.tabs && !state.modal) {
                var stateObject = {
                    url: '/' + state.name,
                    views: {
                        'app': {
                            template: window.dynamicContent.generate(state),
                            // controller:"StateController"
                            controller: function($scope, $stateParams, $timeout,State) {
                                $scope.$on("$ionicView.enter", function() {
                                    $scope.$broadcast("$enter", $stateParams);
                                })
                                $scope.$on("$ionicView.loaded", function() {

                                    if ($stateParams.data) {
                                        $scope.data = $stateParams.data;
                                    }

                                    $scope.$broadcast("$loaded");

                                    if (State.lifecycle && State.lifecycle.loaded){
                                        eval(State.lifecycle.loaded)
                                    }

                                    
                                })
                                $scope.refresh = function() {
                                    $scope.$broadcast("$refresh")
                                }
                            },
                            resolve:{
                                State:function(){
                                    return state;
                                }
                            }
                        }
                    }
                }

                if (state.data) {
                    stateObject.params = {
                        data: null
                    }
                }

                stateProviderRef.state('app.' + state.name, stateObject)
            }

            if (state.tabs) {
                stateProviderRef.state('app.tab.' + state.name, {
                    url: '/' + state.name,
                    views: {
                        'tab-content': {
                            template: window.dynamicContent.generate(state),
                            // controller:"StateController"
                            controller: function($scope, $stateParams, $timeout) {
                                $scope.$on("$ionicView.enter", function() {
                                    $scope.$broadcast("$enter", $stateParams);
                                })
                                $scope.$on("$ionicView.loaded", function() {
                                    $scope.$broadcast("$loaded");
                                })
                                $scope.refresh = function() {
                                    $scope.$broadcast("$refresh")
                                }
                            }
                        }
                    }
                })
            }
        })

        window.location.href = "#/" + window.App.basic.defaultState;
        $rootScope.$broadcast("$app.ready")
    }

    function loadScript(src, callback) {
        var s,
            r,
            t;
        r = false;
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = src;
        s.onload = s.onreadystatechange = function() {
            //console.log( this.readyState ); //uncomment this line to see which ready states are called.
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                callback();
            }
        };
        t = document.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s, t);
    }
})


function InitController($http, $scope, $app,$ocLazyLoad) {
    $scope.fetch = function() {
            // var base = "http://localhost:3456/mobile/100026";
            var base = "https://thebuilder.hk/automator/mobile/"+window.AppId;
            $scope.error = false;
            $http.get(base + "/json").then(function(response) {
                if (response.status <= 400 && response.status != -1) {
                    console.log(response.data);
                    // $app.loadScript(base + "/script", function() {
                    //     console.log("Script Loaded")
                    //     $app.prepare(response.data);
                    // })

                    $ocLazyLoad.load({
                        cache:false,
                        rerun:true,
                        files:[{type:"js",path:base + "/script"}]
                    })
                    .then(function(data){
                        $app.prepare(response.data);
                    },function(err){
                        console.log(err)
                    })
                } else {
                    $scope.error = true
                }
            })

        }
        // $scope.error = true;
    $scope.fetch();

}
