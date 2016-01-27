(function(){

    'use strict';

    angular.module('mxApp.shared.services', [])
        .factory('_', _);

    _.$inject = ['$window'];
    function _($window) {
        return $window._;
    }

})();