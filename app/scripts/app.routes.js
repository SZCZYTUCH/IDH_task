(function() {
    'use strict';
    
        angular.module('IDH').service('routeManager',['$rootScope', '$q', '$location', function($rootScope, $q, $location) {
        var self = this;
        
        self.goToRoute = function (name) {
            if ($rootScope.previousRoute !== name){
                $location.path("/"+name);
            }
        };

        self.route = function (nextSituation, prevSituation, prevRoute, nextRoute) { // UserService is a service module in the code.
            var deferred = $q.defer();
            var _route = prevRoute+' -> '+nextRoute;
            var _situation = prevSituation+' ==>> '+nextSituation;
            console.log(_route);
            console.log(_situation);
            
            $rootScope.loading = true;
            
            var fulfillRoute = function(){
                $rootScope.previousRoute = nextRoute;
                $rootScope.previousSituation = nextSituation;
                $rootScope.loading = false;

                deferred.resolve(true);
            };
            
            var bootUpRoute = function(){
                if ($rootScope.bootingUp) {
                    console.log('Boot up in progress - waiting');
                    var watcher = $rootScope.$watch(function () {
                        return $rootScope.bootingUp;
                    }, function (newValue, oldValue) {
                        if (!newValue) {
                            console.log('Boot up - done');
                            watcher();
                            fulfillRoute();
                        };
                    });
                }else{
                    fulfillRoute();
                }
            };
            
            var manageRoute = function(){

                switch (_situation){
                    case 'undefined ==>> outerScreen'   : {}
                    case 'null ==>> outerScreen'        : {
                        bootUpRoute(); 
                        break;
                    }
                    case 'innerScreen ==>> innerScreen' : {}
                    case 'outerScreen ==>> outerScreen' : {
                        fulfillRoute();
                        break;
                    }
                    
                    case 'outerScreen ==>> innerScreen' : {
                        
                        
                        //trzeba uważać!!!
                        $rootScope.user = {};
                        $rootScope.user.loggedIn = true;
                        //-------------------------------------
                        
                            
                        if ($rootScope.user.loggedIn){
                            console.log('user logged in');
                            fulfillRoute();

                        }else{
                            console.log('user not loged in');

                        }


                        break;
                    }
                    case 'innerScreen ==>> outerScreen' : {
                        if ($rootScope.user.loggedIn){
                            console.log('%c' + 'clicked back button - ended in starting panels: ', 'color: #ffb3b3; font-size: 16px; margin:1px 0; padding:1px; font-family: cursive;text-shadow: -1px 0 #000000, 0 -1px #000000, 1px 0 #000000, 0 1px #000000;');
                            $rootScope.$broadcast('FC:logout on back button');
                            fulfillRoute();
                        }
                        break;
                    }  
                }
                
                
                
            };

            manageRoute();

            return deferred.promise;
        };
    }]);

    angular.module('IDH')
        .config(['$routeProvider', function ($routeProvider) { 
            $routeProvider.when("/",                {templateUrl: "templates/catalogPanel.html",  name: 'catalogPanel',  reloadOnSearch: true, resolve: {routeManager: ['$rootScope', 'routeManager', function($rootScope, routeManager) { return routeManager.route('outerScreen', $rootScope.previousSituation, $rootScope.previousRoute, 'catalogPanel'); }]}});
            
            $routeProvider.when("/catalogPanel",    {templateUrl: "templates/catalogPanel.html",  name: 'catalogPanel',  reloadOnSearch: true, resolve: {routeManager: ['$rootScope', 'routeManager', function($rootScope, routeManager) { return routeManager.route('outerScreen', $rootScope.previousSituation, $rootScope.previousRoute, 'catalogPanel'); }]}});
            

            $routeProvider.otherwise({redirectTo: "/catalogPanel"});
        }]);

})();




