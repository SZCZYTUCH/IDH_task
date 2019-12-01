(function() {
    'use strict';

    angular.module('IDH')

        .config(['$compileProvider', function ($compileProvider) {
            $compileProvider.debugInfoEnabled(false);
        }]);
        

})();

