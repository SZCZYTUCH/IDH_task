(function() {
    'use strict';

    angular.module('IDH')
        .service('modalService',['$rootScope','$uibModal', '$uibModalStack', function($rootScope, $uibModal, $uibModalStack) {
            
            var self = this;
       
            self.showUsersModal = function(data){
                var M = $uibModal.open({
                    //animation: $rootScope.modalAnimations,
                    windowClass:"modal-overlay",
                    templateUrl:"./templates/modals/showUsersModal.html",
                    controller:"showUsersModalController",
                    backdrop: 'static',
//                    internalType: 'nO',
                    resolve:{
                        modalData: function(){return data;}
//                        localData: function(){return data;}
                    }
                });
                M.result.then(angular.noop,angular.noop);
                return M;
            };

        }]);
})();