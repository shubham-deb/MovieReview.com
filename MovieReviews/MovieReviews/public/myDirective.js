(function () {

    angular.module("WDP").directive('goBack', function ($window) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('click', function() {
                    $window.history.back();
                });
            }
        };
    });
})();