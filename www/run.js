angular.module("automator")

.run(function($ionicPlatform, $templateCache, $rootScope, $ionicHistory, $http) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }

        if (window.cordova && window.cordova.InAppBrowser) {
            window.open = cordova.InAppBrowser.open;
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on("$stateChangeStart", function(ev, toState) {
        if (toState.name.indexOf("tab") != -1) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true,
            });
        }
    })

    $templateCache.put('templates/init.html', `
        <div layout="column" layout-align="center center">
            <p style="margin:0">This app relies on online environment</p>
            <h2>The App Is Loading</h2>
            <div ng-show="error">
                <p style="color:red">Network error, try to reload</p>
                <md-button class="md-raised md-primary" ng-click="fetch()" style="margin:0;width:100%">Reload</md-button>
            </div>
            
        </div>
        `);

    $templateCache.put('templates/tabs.html', `
        <div>
            <ion-nav-view name="tab-content"></ion-nav-view>
            <ion-tabs class="tabs-icon-top tabs-color-active-positive">

            
            <ion-tab title="Projects" icon-off="ion-ios-list-outline" icon-on="ion-ios-list" href="#/app/tab/projects">
              
            </ion-tab>
            
            <ion-tab title="Setting" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear" href="#/app/tab/setting">
              
            </ion-tab>
            


            </ion-tabs>

        </div>
        `);

    $templateCache.put('templates/app.html', `
        <div> 
            <ion-nav-bar class="bar-dark">
                <ion-nav-back-button>
                </ion-nav-back-button>
            </ion-nav-bar>

            <ion-nav-view name="app"></ion-nav-view>
        </div>
        `);




})




.controller("StateController", function($scope, $stateParams) {

})
