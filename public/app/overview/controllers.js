(function () {
    'use strict';

    angular
        .module('mxApp.overview.controllers', [])
        .controller('DashboardController', DashboardController)
        .controller('OverviewController', OverviewController);

    DashboardController.$inject = ['$mdSidenav'];
    function DashboardController($mdSidenav) {
        var dashboardVm = this;

        dashboardVm.toggleMenu = function () {
            $mdSidenav('left').toggle();
        }
    }

    OverviewController.$inject = ['$state', '$mdSidenav'];
    function OverviewController($state, $mdSidenav) {
        //
        var overviewVm = this;

        overviewVm.toggleMenu = function () {
            $mdSidenav('left').toggle();
        }
    }
})();