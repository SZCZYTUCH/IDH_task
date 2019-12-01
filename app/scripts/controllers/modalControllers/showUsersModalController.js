(function () {
    'use strict';

    angular.module('IDH')
        .controller('showUsersModalController', ['$scope', '$rootScope', '$uibModalInstance', 'modalData', function ($scope, $rootScope, $uibModalInstance, modalData) {
                                        
            console.log(modalData);    
    
            
                                        
            $scope.cancel = function () {   
                $uibModalInstance.dismiss('User cancel');
            };
            
            $scope.ok = function () {
                $uibModalInstance.close();
            };
            
            $scope.testtest = function(){
                console.log('test test');
            };
            
            $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                var swiper = new Swiper('.swiper-container', {
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    loop: true
                });
                swiper.slideTo(modalData.sorting_position + 1, 0, false);
            });
            
            $scope.loadSwiper = function(){
                
            };
            
                    

            
        }]);

})();