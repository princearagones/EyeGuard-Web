(function(){

    'use strict';

    angular
        .module('app',['ngRoute'])
        .component('verifyComponent', {
            template: require('./verify.html'),
            controller: VerifyController,
            bindings: {
            }
        });
        
    function VerifyController($scope, $http, $location, UserService) {
        console.log("VERIFY");
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

        $scope.reject = function(){
            var user_id =  $(this)[0].guard.ID;

            if (confirm("Are you sure you want to reject this user? " ) == true) {
                $http({
                    method: 'POST',
                    url: '/api/user/delete',
                    data: { 
                        user_id: user_id
                    },
                    dataType: "JSON"
                }).then(function(data){
                    console.log(data);
                    if(!data.data){
                        return Materialize.toast("Error in deleting of user",2500);
                    }
                    for(var i = 0; i < $scope.guards.length; i++) {
                        var obj = $scope.guards[i];
                        if(obj.ID === user_id){
                            $scope.guards.splice(i,1);
                            break;
                        }
                    }
                    return Materialize.toast("Successfully rejected user",2500);
                },function(err){
                    return Materialize.toast("Error in rejecting of user. Please try again!",2500);
                });
            } 
        }

        $scope.username = UserService.getUsername();

        $http({
            method: 'GET',
            url: '/api/getCompanyByUsername',
            dataType: 'JSON'
        }).then(function(data){
            if(!data){
                return Materialize.Toast("No Company ID retrieved",2500);
            }
            UserService.setCompanyID(data.data.CompanyID);
                $scope.guards = [];
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
        },function(err){
            return Materialize.Toast("Error in getting Company ID",2500);
        })
       

        
    }
})();