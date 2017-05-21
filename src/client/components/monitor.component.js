(function(){

    'use strict';

    angular
        .module('app')
        .component('monitorComponent', {
            template: require('./monitor.html'),
            controller: MonitorController,
            bindings: {
            }
        });
        
    function MonitorController($scope, $http, $location, UserService) {
        const vm = this;   
        $scope.username = UserService.getUsername();
        $scope.viewInfo = function(id){
            $location.path('/admin/monitor/'+id);
        }
        $http({
            method: 'GET',
            url: '/api/getCompanyByUsername',
            dataType: 'JSON'
        }).then(function(data){
            if(!data){
                return Materialize.Toast("No Company ID retrieved",2500);
            }
            UserService.setCompanyID(data.data.CompanyID);
            $http({
                method: 'GET',
                url: '/api/getUsers/'+UserService.getCompanyID(),
                dataType: "JSON",
            }).then(function(data){
                if(!data){
                    return Materialize.toast("No Verified users",2500);
                }
                $scope.guards = data.data;
            },function(err){
                return Materialize.toast("Error in getting verified users. Please try again!",2500);
            });
        },function(err){
            return Materialize.Toast("Error in getting Company ID",2500);
        })
    }
})();

