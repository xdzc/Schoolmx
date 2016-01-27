(function() {
    'use strict';
    
    angular
        .module('mxApp', [
            'ui.router', 'mxApp.auth', 'mxApp.overview', 'ngMaterial',
            'satellizer', 'ngMessages', 'mxApp.shared',
            'ngProgress'
        ])
        .config(config)
        .constant('mxApi', {
            URL: 'http://localhost:3000'
        }).run(runBlock);

    config.$inject = ['mxApi', 'authApi', '$urlRouterProvider', '$locationProvider', '$authProvider',
        '$mdThemingProvider'];

    function config(mxApi, authApi, $urlRouterProvider, $locationProvider, $authProvider,
                    $mdThemingProvider) {

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
            .primaryPalette('purple');
            //.accentPallete('')
            //.backgroundPalette('purple');
            //.warnPaletter('');

        $mdThemingProvider.theme('error-toast');
        $mdThemingProvider.theme('success-toast');

        $mdThemingProvider.theme('altTheme')
            .primaryPalette('blue')
            .backgroundPalette('purple').dark();
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