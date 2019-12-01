(function () {
    'use strict';

    angular.module('IDH')
        .controller('catalogController', ['$scope', '$rootScope', 'modalService', function ($scope, $rootScope, modalService) {

            
            $scope.setBackgrundAvatar = function(url){
                return {'background-image': 'url(./assets/images/'+url+')'};
            };
            
            $scope.openMemberModal = function(member){
                modalService.showUsersModal(member);
            };
            
            
        }]);

})();