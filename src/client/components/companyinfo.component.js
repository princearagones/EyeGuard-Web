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
            url: '/api/getOneByID/'+UserService.getCompanyID(),
            dataType: "JSON",
        }).then(function(data){
            if(!data){
                return Materialize.toast("No Company found",2500);
            }
            $scope.companyName = data.data[0].Name;
            $scope.companyCode = data.data[0].Code;
        },function(err){
            return Materialize.toast("Error in getting Company. Please try again!",2500);
        });
    }
})();