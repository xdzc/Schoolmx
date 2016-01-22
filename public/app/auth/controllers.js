(function () {
    'use strict';

    angular
        .module('mxApp.auth.controllers', [])
        .controller('LoginController', LoginController)
        .controller('ForgotPasswordController', ForgotPasswordController)
        .controller('ResetPasswordController', ResetPasswordController);

    LoginController.$inject = ['$state', '$auth', '$mdToast'];
    function LoginController($state, $auth, $mdToast) {

        /* jshint validthis: true */
        var loginVm = this;

        loginVm.progressMode = "";

        loginVm.processLogin = function () {

            loginVm.progressMode = "indeterminate";


            $auth.login(loginVm.credentials)
                .then(function (response) {
                    $state.go('auth_reset');
                }).catch(function (response) {

                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.data)
                        .position('top right')
                        .theme('error-toast')
                        .hideDelay(3000)
                );
            }).finally(function () {
                loginVm.progressMode = "";
            });
        };

    }

    ForgotPasswordController.$inject = ['$http', 'mxApi', 'authApi', '$mdToast'];
    function ForgotPasswordController($http, mxApi, authApi, $mdToast) {

        /* jshint validthis: true */
        var forgotVm = this;

        forgotVm.progressMode = "";

        forgotVm.processReset = function() {

            forgotVm.progressMode = "indeterminate";

            $http.post(mxApi.URL + authApi.BASE_URL +  authApi.RETRIEVE_PASSWORD_URL, forgotVm.credentials)
                .then(function (response) {

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(response.data)
                            .position('top right')
                            .theme('success-toast')
                            .hideDelay(4000)
                    );
                }).catch(function (response) {

                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.data)
                        .position('top right')
                        .theme('error-toast')
                        .hideDelay(3000)
                );
            }).finally(function () {
                forgotVm.progressMode = "";
            })
        };

    }

    ResetPasswordController.$inject = ['$http', 'mxApi', 'authApi', '$mdToast', '$stateParams', '$auth'];
    function ResetPasswordController ($http, mxApi, authApi, $mdToast, $stateParams, $auth) {

        /* jshint validthis: true */
        var resetVm = this;

        resetVm.progressMode = "";

        resetVm.processReset = function () {
            resetVm.progressMode = "indeterminate";

            resetVm.credentials.token = $stateParams.token;

            $http.post(mxApi.URL + authApi.BASE_URL + authApi.RESET_PASSWORD_URL, resetVm.credentials)
                .then(function (response) {

                    /**
                     * Response.data is the authentication token. When users clicks to return to login page, he is
                     * automatically redirected because of this settings (setToken).
                     */
                    $auth.setToken(response.data);

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Your password has been changed, please login.')
                            .position('top right')
                            .theme('success-toast')
                            .hideDelay(4000)
                    );
                })
                .catch(function (response) {

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(response.data)
                            .position('top right')
                            .theme('error-toast')
                            .hideDelay(3000)
                    );
                })
                .finally(function () {
                    resetVm.progressMode = "";

            });

        };
    }
})();