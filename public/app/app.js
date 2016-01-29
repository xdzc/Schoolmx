(function() {
    'use strict';
    
    angular
        .module('mxApp', [
            'ui.router', 'mxApp.auth', 'mxApp.overview', 'ngMaterial',
            'satellizer', 'ngMessages', 'mxApp.shared',
            'ngProgress', 'sasrio.angular-material-sidenav'
        ])
        .config(config)
        .constant('mxApi', {
            URL: 'http://localhost:3000'
        }).run(runBlock);

    config.$inject = ['mxApi', 'authApi', '$urlRouterProvider', '$locationProvider', '$authProvider',
        '$mdThemingProvider', 'ssSideNavSectionsProvider'];

    function config(mxApi, authApi, $urlRouterProvider, $locationProvider, $authProvider,
                    $mdThemingProvider, ssSideNavSectionsProvider) {

        $authProvider.loginUrl = authApi.BASE_URL + '/authenticate';
        $authProvider.baseUrl = mxApi.URL;
        $authProvider.tokenPrefix = 'smx';
        $authProvider.tokenName = 'token';
        $authProvider.storageType = 'sessionStorage';

        $urlRouterProvider.otherwise('/auth/login');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
        $locationProvider.hashPrefix('!');

        $mdThemingProvider
            .theme('default')
            .primaryPalette('blue', {
                'default': '700'
            });

        ssSideNavSectionsProvider.initWithTheme($mdThemingProvider);

        $mdThemingProvider.theme('error-toast');
        $mdThemingProvider.theme('success-toast');

        ssSideNavSectionsProvider.initWithSections([{
            id:     'toogle_1',
            //name:   'DASHBOARD',
            type:   'heading',
            children: [{
                name:   'Toogle 1',
                type:   'toggle',
                pages:  [{
                    id:     'toggle_item_1',
                    name:   'item 1',
                    state:  'common.toggle.item1',
                    icon: 'fa fa-battery-empty',
                }, {
                    id:     'toggle_item_2',
                    name:   'item 2',
                    icon: 'fa fa-fire',
                    state:  'common.toggle.item2'
                }]
            }]
        }, {
            id:         'link_1',
            name:       'Simple link to Index state',
            state:      'common.index',
            type:       'link',
            hidden: true // show menu ('true' for hide menu)
        },{
            id:     'toogle_11',
            type:   'heading',
            children: [{
                name:   'Toogle 1',
                type:   'toggle',
                pages:  [{
                    id:     'toggle_item_11',
                    name:   'item 1',
                    state:  'common.toggle.item1'
                }, {
                    id:     'toggle_item_21',
                    name:   'item 2',
                    state:  'common.toggle.item2'
                }]
            }]
        }]);
    }

    runBlock.$inject = ['$rootScope', 'userService', '$state'];
    function runBlock($rootScope, userService, $state) {

        /**
         * Re-initializes the userService in the event of a browser refresh.
         */
        userService.init();
        $rootScope.$on('$stateChangeSuccess', function (event, currentState, previousState) {
            $rootScope.title = currentState.data.title;
        });
    }
})();