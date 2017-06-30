 angular.module("automator")

 .factory("$api", function($apiBase, $http) {
     return {
         get: function(url) {
             return $http.get($apiBase + url)
         },
         post: function(url, body) {
             return $http.post($apiBase + url, body)
         },
         put: function(url, body) {
             return $http.put($apiBase + url, body)
         }
     }
 })

 .constant("$apiBase", "https://bu.ildm.in/d/api/v2")

 .directive("builderApi", function($http, $state) {
     return {
         restrict: "A",
         scope: {
             builderApiData: "=",
             builderApiUrl: "@"
         },
         link: function($scope, $element, $attrs) {
             $element.bind("click", function() {
                 var method = $attrs.builderApiMethod;
                 var url = $scope.builderApiUrl;
                 var data = $scope.builderApiData;

                 if (!url) {
                     return;
                 }

                 console.log(method, url, data)

                 $http({
                     method: method || "GET",
                     url: url,
                     data: data
                 }).then(function(response) {

                     if (response.status >= 400) {
                         return;
                     } else {
                         try {
                             eval($attrs.builderApiSuccess)
                         } catch (err) {

                         }

                     }
                 })
             })
         }
     }
 })

 .factory("$modal", function($ionicModal) {
         return {
             "new-project": $ionicModal.fromTemplate(
                 `
            <ion-modal-view>
                <ion-header-bar class="bar bar-header bar-positive">
                  <h1 class="title">New Project</h1>
                  <button class="button button-clear button-primary" ng-click="modal.hide()">Cancel</button>
                </ion-header-bar>
                <ion-content scroll="" class="">
    
                </ion-content>
            </ion-modal-view>
            `
             )
         }
     })
     .directive("browserOpen", function() {
         return {
             restrict: "A",
             scope: true,
             link: function($scope, $element, $attrs, $timeout) {
                 $element.bind("click", function() {
                     window.open($attrs.browserOpen, "_blank")
                 })
             }
         }
     })
     .factory("$barcode", function($q) {
         return {
             scan: function() {
                 var q = $q.defer()
                 if (window.cordova && window.cordova.plugins && window.cordova.plugins.barcodeScanner) {
                     cordova.plugins.barcodeScanner.scan(
                         function(result) {
                             q.resolve(result);
                         },
                         function(error) {
                             q.reject()
                         }, {
                             preferFrontCamera: false, // iOS and Android
                             showFlipCameraButton: true, // iOS and Android
                             showTorchButton: true, // iOS and Android
                             prompt: "Place a barcode inside the scan area", // Android
                             resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                             formats: "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                             disableAnimations: true, // iOS
                             disableSuccessBeep: false // iOS
                         }
                     );
                 } else {
                     q.reject()
                 }
                 return q.promise
             }
         }
     })

 .directive("builderQr", function($http, $compile, $state, $barcode) {
     return {
         restrict: "A",
         scope: true,
         link: function($scope, $element, $attrs) {
             $element.bind("click", function() {
                 $barcode.scan().then(function(result) {
                     if (!result.cancelled) {
                         $state.go($attrs.builderQr, {
                             data: {
                                 qr: result.text
                             }
                         })
                     }
                 })
             })
         }
     }
 })


 .config(function($httpProvider, $stateProvider) {

     var startPage = `
    <ion-view hide-nav-bar="true" cache-view="false">
       <ion-content scroll="false" class="auth-module">

            <video id="background-video" class="auth-background-video" playsinline autoplay muted loop webkit-playsinline></video>
            <img class="auth-background-image" src="https://images.pexels.com/photos/1984/black-and-white-city-man-people.jpg?w=1260&amp;h=750&amp;auto=compress&amp;cs=tinysrgb">

            <div ng-if="vm.status=='initial'">
                  
                <div class="auth-icon-center">
                    <img src="https://buildmind.b0.upaiyun.com/thebuilder/images/logos/thebuilder-circle-light.png">
                </div>
                  
                      
                <div class="auth-bottom-button">
                    <div layout="row" >
                          <md-button class="md-raised md-primary" flex ng-click="vm.status='login'">Login</md-button>
                          <md-button class="md-raised" flex ng-click="vm.status='register'">Sign Up</md-button>
                    </div>
                    <p>Presented By The Builder</p>
                </div>
            </div>

            <div ng-if="vm.status=='login'" class="auth-view">

                <i class="icon ion-ios-close-empty close-icon" ng-click="vm.status='initial'"></i>
                <form name="loginForm" class="auth-list" ng-submit="loginForm.$valid && vm.login()">
                  <label class="item item-input">
                    <span class="input-label">{{'Username'}}</span>
                    <input type="text" name="info" ng-model="vm.user.info" required>
                  </label>
                  <label class="item item-input">
                    <span class="input-label">{{'Password'}}</span>
                    <input type="password" name="password" ng-model="vm.user.password" required>
                  </label>

                  <p style="color:red;margin:5px 0" ng-show="vm.error">Username or password incorrect</p>

                  <md-button class="md-raised md-primary md-block" type="submit">{{'Login'}}</md-button>

                  <div layout="row">
                    <p flex></p>
                    <p flex><a ng-click="vm.status='register'">{{'Go Sign Up'}}</a></p>
                  </div>
                  
                </form>

            </div>

            <div ng-if="vm.status=='register'" class="auth-view">
                <i class="icon ion-ios-close-empty close-icon" ng-click="vm.status='initial'"></i>
                <form name="vm.regForm" class="auth-list" ng-submit="vm.register()">
                  <label class="item item-input">
                    <span class="input-label">{{'Email'}}</span>
                    <input type="email" ng-model="vm.user.email" required>
                  </label>
                  <label class="item item-input">
                    <span class="input-label">{{'Username'}}</span>
                    <input type="text" ng-model="vm.user.name" required>
                  </label>
                  <label class="item item-input">
                    <span class="input-label">{{'Password'}}</span>
                    <input type="password" ng-model="vm.user.password" required>
                  </label>

                  <p style="color:red;margin:5px 0" ng-show="vm.regError">Cannot Register</p>
                  
                  <md-button class="md-raised md-primary md-block" type="submit">{{'Register'}}</md-button>

                  <div layout="row">
                    <p flex><a ng-click="vm.status='login'">{{'Go Login'}}</a></p>
                    <p flex></p>
                  </div>
                </form>

            </div>
        </ion-content>
   </ion-view>
    `


     $httpProvider.interceptors.push('authInterceptor');

     $stateProvider

         .state('app.auth', {
         url: '/auth',
         views: {
             'app': {
                 template: startPage,
                 controller: function($account, $mdDialog) {
                     var vm = this;
                     vm.status = 'initial';


                     vm.login = function() {
                         console.log(vm.user);
                         vm.error = false;
                         $account.login({
                             userinfo: vm.user.info,
                             password: vm.user.password,
                         }).then(function() {
                             // authComplete();
                         }, function(err) {
                             vm.error = true;
                         })
                     }

                     vm.register = function() {
                         console.log(vm.user);
                         vm.regError = false;
                         if (!vm.regForm.$valid) {
                             $mdDialog.show(
                                 $mdDialog.alert()
                                 .clickOutsideToClose(true)
                                 .title('Your Form Has Errors')
                                 .ariaLabel('Form Error')
                                 .ok('Got it!')
                             );

                             return;
                         }

                         $account.register({
                             email: vm.user.email,
                             name: vm.user.name,
                             password: vm.user.password,
                             reg_type: "email",
                             reg_from: "The Builder"
                         }).then(function() {
                             // authComplete();
                         }, function(err) {
                             vm.regError = true;
                         })
                     }
                 },
                 controllerAs: "vm"
             }
         }

     })


 })

 .directive("accountLogout", function($account) {
     return {
         restrict: "A",
         link: function(scope, element) {
             element.bind("click", function() {
                 $account.logout();
             })
         }
     }
 })

 .run(function(
     $account,
     $rootScope,
     $timeout
 ) {



     $rootScope.$on("$app.ready", function() {
        $account.successUrl = window.App.modules.account.successState;
        $account.errorUrl = window.App.modules.account.errorState;
         $account.auth().then(function(user) {

         }, function() {

         })
     })



 })

 .factory("$account", function($q, $api, $rootScope) {
     var auth_endpoint = "/auth"
     var login_endpoint = "/login"
     var register_endpoint = "";

     var self = {
         user: {},
         login: login,
         register: register,
         auth: auth,
         logout: logout,

         success: success,
         successUrl:"",
         error: error,
         errorUrl:""
     }

     function login(userObject) {
         var q = $q.defer()

         if (userObject.userinfo && userObject.userinfo != '' && userObject.password && userObject.password != '') {
             $api.post(login_endpoint, userObject).then(function(response) {

                 if (response.status >= 400 || response.status == -1) {
                     q.reject();
                     return;
                 }
                 self.user = response.data;
                 $rootScope.$broadcast("$auth.success", self.user);
                 self.success();

                 window.localStorage.id = self.user.id;
                 window.localStorage.session = self.user.session;

                 if (window.ga) {
                     ga('send', {
                         hitType: 'event',
                         eventCategory: 'User',
                         eventAction: 'Login',
                         eventLabel: 'The Builder',
                         eventValue: 1
                     });
                 }

                 q.resolve(self.user);
             }, function() {

             })
         }

         return q.promise;
     }

     function auth() {
         var q = $q.defer();

         if (self.user.id) {
             q.resolve(self.user);
         } else if (window.localStorage.id && window.localStorage.session) {

             $api.post(auth_endpoint).then(function(response) {

                 if (response.status >= 400 || response.status == -1) {
                     delete window.localStorage.id;
                     delete window.localStorage.session;
                     self.error();
                     q.reject();
                     return;
                 }
                 self.user = response.data;
                 $rootScope.$broadcast("$auth.success", self.user);
                 console.log("User", self.user);

                 self.success();
                 q.resolve(self.user);

                 if (window.ga) {
                     ga('send', {
                         hitType: 'event',
                         eventCategory: 'User',
                         eventAction: 'Login',
                         eventLabel: 'The Builder',
                         eventValue: 1
                     });
                 }
             }, function() {
                 delete window.localStorage.id;
                 delete window.localStorage.session;
                 q.reject();
             })

         } else {
             console.log("No User Id!")
             self.error();
             q.reject();
         }

         return q.promise;
     }

     function register(userObject) {
         var q = $q.defer();
         $api.post(register_endpoint, userObject).then(function(response) {

             if (response.status >= 400 || response.status == -1) {
                 q.reject();
                 return;
             }
             var data = response.data;
             console.log(data);


             self.user = data;
             window.localStorage.id = self.user.id;
             window.localStorage.session = self.user.session;

             $rootScope.$broadcast("$auth.success", self.user);
             q.resolve(self.user);

             if (window.ga) {
                 ga('send', {
                     hitType: 'event',
                     eventCategory: 'User',
                     eventAction: 'Register',
                     eventLabel: 'The Builder',
                     eventValue: 1
                 });
             }
         }).error(function() {
             q.reject()
         })

         return q.promise;
     }

     function logout() {
         delete window.localStorage.id;
         delete window.localStorage.session;
         self.error();
     }

     function success() {
         window.location.href = self.successUrl;
     }

     function error() {
         window.location.href = self.errorUrl;
     }

     return self;
 })


 .factory('authInterceptor', function($apiBase) {
     return {
         request: function(config) {

             if (config.url.indexOf($apiBase) != -1) {
                 config.headers.id = window.localStorage.id;
                 config.headers.session = window.localStorage.session;
             }

             return config;
         },

         requestError: function(config) {
             return config;
         },

         response: function(res) {
             return res;
         },

         responseError: function(res) {
             return res;
         }
     };
 })



 .directive("builderIsolate", function() {
     return {
         restrict: "A",
         scope: true,
         link: function($scope, $element, $attrs, $timeout) {
             if (!$attrs.builderIsolate) {
                 return;
             }
             var object = JSON.parse($attrs.builderIsolate);
             for (var property in object) {
                 if (object.hasOwnProperty(property)) {
                     // do stuff
                     $scope[property] = object[property];
                 }
             }
         }
     }
 })

 .directive("builderDataList", function($http, $compile) {
     return {
         restrict: "E",
         scope: true,
         link: function($scope, $element, $attrs) {

             $scope.$on("$enter", function() {
                 // console.log("entering")
                 // fetch();
             })

             $scope.$on("$loaded", function() {
                 // console.log("entering")
                 fetch();
             })

             $scope.$on("$refresh", function() {
                 // console.log("entering")
                 fetch();
             })

             function fetch() {
                 $scope.datas = [];
                 $http.get($attrs.source).then(function(response) {

                     if (response.status >= 400) {
                         return;
                     }

                     console.log(response);

                     console.log($attrs.path)
                     if (!$attrs.path || $attrs.path == "") {
                         $scope.datas = response.data;
                     } else {
                         $scope.datas = byString(response.data, $attrs.path);
                     }


                     $scope.$parent.$broadcast('scroll.refreshComplete');
                 })
             }

             function byString(o, s) {
                 s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
                 s = s.replace(/^\./, ''); // strip a leading dot
                 var a = s.split('.');
                 for (var i = 0, n = a.length; i < n; ++i) {
                     var k = a[i];
                     if (k in o) {
                         o = o[k];
                     } else {
                         return;
                     }
                 }
                 return o;
             }
         }
     }
 })
