(function () {
    'use strict';

    angular
        .module('mxApp.overview.controllers', [])
        .controller('OverviewController', OverviewController);


    OverviewController.$inject = ['$controller', 'ssSideNav'];
    function OverviewController($controller, ssSideNav) {
        //
        var overviewVm = this;

        ssSideNav.setVisible('link_1', true);
        ssSideNav.setVisible('toogle_11', false);

        console.log('Overview controller.');

    }
})();