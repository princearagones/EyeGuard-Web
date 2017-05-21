(function(){

    'use strict';

    angular
        .module('app')
        .component('adminComponent', {
            template: require('./admin.html'),
            controller: AdminController,
            bindings: {
            }
        });

    function AdminController($scope, $http, UserService){
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
        },function(err){
            return Materialize.Toast("Error in getting Company ID",2500);
        })
    }
})();
