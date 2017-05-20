(function(){

    'use strict';

    angular
        .module('app')
        .component('verifyComponent', {
            template: require('./verify.html'),
            controller: VerifyController,
            bindings: {
            }
        });
        
    function VerifyController($scope, $http, $location, UserService) {
        const vm = this;  
        $scope.verify = function(){
            var user_id =  $(this)[0].guard.ID;

            if (confirm("Are you sure you want to verify this user? " ) == true) {
                $http({
                    method: 'PUT',
                    url: '/api/user/validate',
                    data: {
                        user_id: user_id
                    },
                    dataType: "JSON"
                }).then(function(data){
                    if(!data){
                        return Materialize.toast("Error in updating IsVerified of user",2500);
                    }
                    for(var i = 0; i < $scope.guards.length; i++) {
                        var obj = $scope.guards[i];
                        if(obj.ID === user_id){
                            $scope.guards.splice(i,1);
                            break;
                        }
                    }
                    return Materialize.toast("Successfully verified user",2500);
                },function(err){
                    return Materialize.toast("Error in updating IsVerified of user. Please try again!",2500);
                });
            } 
        };

        $scope.username = UserService.getUsername();
        $http({
            method: 'GET',
            url: '/api/getUnverifiedUsers/'+UserService.getCompanyID(),
            dataType: "JSON",
        }).then(function(data){
            if(!data){
                return Materialize.toast("No unverified users",2500);
            }
            $scope.guards = data.data;
        },function(err){
            return Materialize.toast("Error in getting unverified users. Please try again!",2500);
        });

        
    }
})();