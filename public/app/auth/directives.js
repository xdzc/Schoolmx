(function () {
    'use strict';

    angular.module('mxApp.auth.directives', [])
        .directive('compareTo', compareTo);

    function compareTo() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=compareTo'
            },
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch('otherModelValue', function () {
                    ngModel.$validate();
                });
            }
        };
    }
})();