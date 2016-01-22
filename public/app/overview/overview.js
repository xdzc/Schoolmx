(function () {
    'use strict';

    angular
        .module('mxApp.overview', ['mxApp.overview.controllers']);

    angular
        .module('mxApp')
        .config(overviewConfig);

    overviewConfig.$inject = ['$stateProvider']

    function overviewConfig($stateProvider) {
        $stateProvider
            .state('dashboard', {

                templateUrl: 'app/shared/views/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'dashboardVm',
                abstract: true
            })
            .state('overview', {
                url: '/overview',
                controller: 'OverviewController',
                controllerAs: 'overviewVm',
                templateUrl: 'app/overview/views/overview.html',
                parent: 'dashboard',
                data: {
                    title: 'Overview'
                }
            })
    }
})();