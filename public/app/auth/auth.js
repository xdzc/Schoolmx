(function(){
    'use strict';

    angular
        .module('mxApp.auth', ['mxApp.auth.controllers', 'mxApp.auth.directives',
            'mxApp.auth.services'])
        .constant('authApi', {
            BASE_URL: '/auth',
            RETRIEVE_PASSWORD_URL: '/retrieve-password',
            RESET_PASSWORD_URL: '/reset-password'
        });

    angular
        .module('mxApp')
        .config(authConfig);

    authConfig.$inject = ['$stateProvider'];
    function authConfig($stateProvider) {
        $stateProvider
            .state('auth', {

            templateUrl: 'app/auth/views/auth.html',
            abstract: true
        }).state('auth_login', {

            url: '/auth/login',
            controller: 'LoginController',
            controllerAs: 'loginVm',
            templateUrl: 'app/auth/views/login.html',
            parent: 'auth',
            data: {
                title: 'Login'
            }
        }).state('auth_forgot', {

            url: '/auth/forgot-password',
            controller: 'ForgotPasswordController',
            controllerAs: 'forgotVm',
            templateUrl: 'app/auth/views/forgot.html',
            parent: 'auth',
            data: {
                title: 'Forgot Password?'
            }
        }).state('auth_reset', {

            url: '/auth/reset-password/:token',
            controller: 'ResetPasswordController',
            controllerAs: 'resetVm',
            templateUrl: 'app/auth/views/reset.html',
            parent: 'auth',
            data: {
                title: 'Password Reset'
            }
        });
    }
})();