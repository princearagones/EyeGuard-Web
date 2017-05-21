(function(){

    'use strict';

    angular
        .module('app')
        .component('companyinfoComponent', {
            template: require('./companyinfo.html'),
            controller: companyinfoController,
            bindings: {
            }
        });
    function companyinfoController($scope, $http, UserService){
    	const vm = this;
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
                url: '/api/getOneByID/'+UserService.getCompanyID(),
                dataType: "JSON",
            }).then(function(data){
                if(!data){
                    return Materialize.toast("No Company found",2500);
                }
                console.log(data);
                $scope.companyName = data.data.Name;
                $scope.companyCode = data.data.Code;
            },function(err){
                return Materialize.toast("Error in getting Company. Please try again!",2500);
            });
        },function(err){
            return Materialize.Toast("Error in getting Company ID",2500);
        });
        
    }
})();