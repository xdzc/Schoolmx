(function () {
    'use strict';

    angular
        .module('mxApp.auth.controllers', [])
        .controller('LoginController', LoginController)
        .controller('ForgotPasswordController', ForgotPasswordController)
        .controller('ResetPasswordController', ResetPasswordController);

    LoginController.$inject = ['authService'];
    function LoginController(authService) {

        /* jshint validthis: true */
        var loginVm = this;

        loginVm.processLogin = function () {

            authService.processLogin(loginVm.credentials);
        };

    }

    ForgotPasswordController.$inject = ['authService'];
    function ForgotPasswordController(authService) {

        /* jshint validthis: true */
        var forgotVm = this;

        forgotVm.processReset = function() {

            authService.processRetrieve(forgotVm.credentials);
        };

    }

    ResetPasswordController.$inject = ['$stateParams', 'authService'];
    function ResetPasswordController ($stateParams, authService) {

        /* jshint validthis: true */
        var resetVm = this;

        resetVm.processReset = function () {

            resetVm.credentials.token = $stateParams.token;

            authService.processReset(resetVm.credentials);
        };
    }
})();