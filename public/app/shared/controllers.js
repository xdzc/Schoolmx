(function(){
    'use strict';

    angular.module('mxApp.shared.controllers', ['mxApp.shared.directives'])
        .controller('BaseController', BaseController)
        .controller('DashboardController', DashboardController);

    BaseController.$inject = [''];
    function BaseController() {
        console.log('Base Controller.');
    }

    DashboardController.$inject = ['$mdSidenav', 'authService', 'userService', 'ssSideNav'];
    function DashboardController($mdSidenav, authService, userService, ssSideNav) {
        var dashboardVm = this;

        dashboardVm.user = userService.user.name.simple;

        dashboardVm.toggleMenu = function () {
            $mdSidenav('left').toggle();
        };

        dashboardVm.logout = function () {
            authService.processLogout();
        };

        dashboardVm.menu = ssSideNav;
    }
})();