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

.factory('$app',function($rootScope,$state){
    return {
        prepare:function(app){
            window.AppPrepare($rootScope,$state,app)
        }
    }
})    

function InitController($http, $scope,$ocLazyLoad,$app) {
    $scope.fetch = function() {
            var base = "http://localhost:3456/mobile/100202";
            // var base = "https://thebuilder.hk/automator/mobile/"+window.AppId;
            $scope.error = false;
            $http.get(base + "/json").then(function(response) {
                if (response.status <= 400 && response.status != -1) {
                    console.log(response.data);
                    // $app.loadScript(base + "/script", function() {
                    //     console.log("Script Loaded")
                    //     $app.prepare(response.data);
                    // })
                    window.App = response.data;
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
