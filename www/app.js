angular.module("automator")

.factory("$app", function($http,$rootScope,dynamicContent) {
    return {
        prepare: prepare
    }

    function prepare(app) {
        window.App = app;


        window.App.states.forEach(function(state) {
            if (!state.tabs && !state.modal) {
                var stateObject = {
                    url: '/' + state.name,
                    views: {
                        'app': {
                            template: dynamicContent.generate(state),
                            // controller:"StateController"
                            controller: function($scope, $stateParams, $timeout) {
                                $scope.$on("$ionicView.enter", function() {
                                    $scope.$broadcast("$enter", $stateParams);
                                })
                                $scope.$on("$ionicView.loaded", function() {

                                    if ($stateParams.data) {
                                        $scope.data = $stateParams.data;
                                    }
                                    $scope.$broadcast("$loaded");



                                })
                                $scope.refresh = function() {
                                    $scope.$broadcast("$refresh")
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
                            template: dynamicContent.generate(state),
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
})

.factory("dynamicContent", function() {
        return {
            generate: function(state) {
                var html = "";

                html += `<ion-view view-title="` + state.title + `" hide-nav-bar="` + state.hideNavBar + `" cache-view="` + (state.data ? false : true) + `">`;

                if (state.primaryButton) {

                    html += `<ion-nav-buttons side="primary">`

                    state.primaryButton.forEach(function(button) {

                        html += `<button class="button button-icon icon ` + button.icon + `" ` + button.attrs + `>
                      ` + (button.text ? button.text : "") + `
                  </button>`

                    })
                    html += `</ion-nav-buttons>`

                }

                if (state.secondaryButton) {

                    html += `<ion-nav-buttons side="secondary">`

                    state.secondaryButton.forEach(function(button) {

                        html += `<button class="button button-icon icon ` + button.icon + `" ` + button.attrs + `>
                      ` + (button.text ? button.text : "") + `
                  </button>`

                    })
                    html += `</ion-nav-buttons>`

                }



                html += `<ion-content scroll="` + (state.scroll == false ? false : true) + `" class="` + (state.tabs ? "has-tabs":"") + `">`

                var sections = state.sections;
                sections.forEach(function(section) {
                    switch (section.type) {
                        case "html":

                            html +=
                                `<div class="` + (section.hasPadding ? 'padding' : '') + `" ` + (section.scope ? `builder-isolate='` + JSON.stringify(section.scope) + `'` : '') + `>
                            ` + section.data +
                                `
                        </div>`

                            break;
                        case "data-html":
                            html += `<thebuilder-data-html 
                            data-path="` + section.data.path + `" 
                            data-source="` + section.data.url + `">
                            <div class="` + section.hasPadding ? 'padding' : '' + `">
                                ` + section.data + `
                            </div>
                        </thebuilder-data-html>`
                            break;
                        case "data-list":

                            html += `
                        <ion-refresher
                            pulling-text="` + section.data.refreshText + `"
                            on-refresh="refresh()">
                        </ion-refresher>
                        <builder-data-list data-path="` +
                                (section.data.path ? section.data.path : "") +
                                `" data-source="` + section.data.url + `" child-state="` + section.data.child + `">
                            <div class="list">
                                <div ng-repeat="data in datas" ui-sref="app.` + section.data.detailState + `({data:data})">
                                    ` + section.data.template + `
                                </div>
                            </div>
                        </builder-data-list>
                        `
                            break;
                        case "href-list":
                            section.data.forEach(function(item) {

                                if (!item.divider) {
                                    html += ` <a class="item item-icon-right" href="` + item.url + `" 
                            ` + (item.state ? 'ui-sref=app.' + item.state + '({data:data})' : "") + ` 
                            ` + (item.showIf ? 'ng-if=' + item.showIf : '') + `
                            ` + item.attrs + `
                            >
                                ` + item.name + `
                                <i class="icon ion-ios-arrow-right"></i>
                            </a>`
                                }

                                if (item.divider) {
                                    html += `
                            <div class="item item-divider">
                                ` + item.name + `
                            </div>`
                                }

                            })
                            break;

                        case "thumbnail-list":

                            section.data.forEach(function(item) {


                                html += `<a class="item item-thumbnail-left item-icon-right" href="` + item.url + `" ` +
                                    (item.state ? 'ui-sref=app.' + item.state + '({data:data})' : "") +
                                    (item.showIf ? 'ng-if=' + item.showIf : '') + ` ` + item.attrs + `
                            >
                                <img src="` + item.thumbnail + `">
                                <h2>` + item.name + `</h2>
                                <p style="white-space:initial">` + item.detail + `</p>
                                <i class="icon ion-ios-arrow-right"></i>
                            </a>`


                            })
                            break;
                    }
                })

                html += `
                </ion-content>
            </ion-view>`

                return html;
            }
        }
    })
