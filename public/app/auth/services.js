(function () {
    "use strict";

    angular.module('mxApp.auth.services', [])
        .factory('userService', userService)
        .factory('authService', authService)
        .factory('notificationService', notificationService);

    userService.$inject = ['jwtHelper'];
    function userService(jwtHelper) {
        return {
            user: {},
            fromToken: function (token) {
                var _token = token.split(' ');
                this.user = jwtHelper.decodeToken(_token[1]);
            },
            isAuthed: function () {
                return Math.round(new Date().getTime() / 1000) <= this.user.exp;
            }
        }
    }

    authService.$inject = ['$auth', 'userService', 'notificationService', '$http', 'mxApi', 'authApi', '$state'];
    function authService($auth, userService, notificationService, $http, mxApi, authApi, $state) {
        return {
            /**
             * Tries to authenticate the user with the passed in credentials.
             * @param credentials
             */
            processLogin: function(credentials) {
                notificationService.progress.start();
                if (credentials.remember) {
                    $auth.setStorageType('localStorage');
                } else {
                    $auth.setStorageType('sessionStorage');
                }

                $auth.login(credentials)
                    .then(function (response) {

                        notificationService.progress.end();
                        notificationService.success(response.data.token);
                        userService.fromToken(response.data.token);
                        // Redirect to dashboard.
                        $state.go('auth_reset');
                    }).catch(function (response) {

                        notificationService.progress.abort();
                        notificationService.error(response.data);
                });
            },

            /**
             * Sets the token application wide.
             *
             * This is mainly used after a successful password reset to
             * remove the need for explicit login. The token is then decoded and stored (user).
             * @param token
             */
            setToken: function(token) {
                $auth.setToken(token);
                userService.fromToken(token);
            },

            /**
             * completely remove the logged in users information before redirecting to lock screen
             */
            processLogout: function () {

                if ($auth.isAuthenticated()) {
                    userService.user = {};
                    $auth.logout();
                }
            },

            /**
             * Initiates the password reset process for user with credentials.
             * @param credentials
             */
            processRetrieve: function (credentials) {

                notificationService.progress.start();
                $http.post(mxApi.URL + authApi.BASE_URL +  authApi.RETRIEVE_PASSWORD_URL, credentials)
                    .then(function (response) {

                        notificationService.progress.end();
                        notificationService.success(response.data);
                    }).catch(function (response) {

                        notificationService.progress.abort();
                        notificationService.error(response.data);
                });
            },

            /**
             * Sents the user credentials for password resetting.
             * @param credentials
             */
            processReset: function (credentials) {

                notificationService.progress.start();
                $http.post(mxApi.URL + authApi.BASE_URL + authApi.RESET_PASSWORD_URL, credentials)
                    .then(function (response) {

                        /**
                         * Response.data is the authentication token. When a user click to return to
                         * login page, he/she is automatically redirected because of this setting (setToken).
                         */
                        this.setToken(response.data.token);
                        notificationService.progress.end();
                        notificationService.success('Your password has been changed, please login.');
                    })
                    .catch(function (response) {

                        notificationService.progress.abort();
                        notificationService.error(response.data);
                    });
            }
        }
    }

    notificationService.$inject = ['$mdToast', 'ngProgressFactory'];
    function notificationService($mdToast, ngProgressFactory) {
        var ngProgress = ngProgressFactory.createInstance();

        return {
            error: function (message) {

                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .position('top right')
                        .theme('error-toast')
                        .hideDelay(4000)
                );
            },
            success: function (message) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .position('top right')
                        .theme('success-toast')
                        .hideDelay(4000)
                );
            },
            warning: function (message) {

            },
            info: function (message) {

            },
            progress: {
                start: function () {
                    ngProgress.start();
                },
                end: function () {
                    ngProgress.complete();
                },
                abort: function () {
                    ngProgress.reset();
                }
            }
        }
    }
})();