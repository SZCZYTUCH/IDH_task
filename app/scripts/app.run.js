(function () {
    'use strict';

    angular.module('IDH')
            .run(['$rootScope', '$location', '$timeout', 'APP_CONFIG', function ($rootScope, $location, $timeout, APP_CONFIG) {

                console.log(APP_CONFIG);
        
                $rootScope.loading = false;
                $rootScope.previousRoute = null;
                $rootScope.previousSituation = null;
                
                $rootScope.bootingUp = true;
                $rootScope.backgroundPosition = 0;
                
                $rootScope.membersData = APP_CONFIG.users;
                
                $location.path("/catalogPanel");
                
                
                $timeout(function () {
                    $rootScope.bootingUp = false;
                }, 1000);
            
                    
                    
            }]);

})();