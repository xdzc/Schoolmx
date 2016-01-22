(function() {
    'use strict';
    
    angular
        .module('mxApp', [
            'ui.router', 'mxApp.auth', 'mxApp.overview', 'ngMaterial',
            'satellizer', 'ngMessages', 'mxApp.shared'
        ])
        .config(config)
        .constant('mxApi', {
            URL: 'http://localhost/schoolmx.api/public/api'
        }).run(runBlock);

    config.$inject = ['$interpolateProvider', 'mxApi',
        '$urlRouterProvider', '$locationProvider', '$authProvider', '$mdThemingProvider'];

    function config($interpolateProvider, mxApi,
                    $urlRouterProvider, $locationProvider, $authProvider, $mdThemingProvider) {

        //$interpolateProvider.startSymbol('[[');
        //$interpolateProvider.endSymbol(']]');

        $authProvider.loginUrl = '/authenticate';
        $authProvider.baseUrl = mxApi.URL;
        $authProvider.tokenPrefix = 'smx';
        $authProvider.tokenName = 'token';

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

    runBlock.$inject = ['$rootScope'];
    function runBlock($rootScope) {
        //$rootScope.title = $state.current.data.title;
        $rootScope.$on('$stateChangeSuccess', function (event, currentState, previousState) {
            $rootScope.title = currentState.data.title;
        });
    }
})();