(function(){

    'use strict';

    angular
        .module('app')
        .component('homeComponent', {
            template: require('./home.html'),
            controller: HomeController,
            bindings: {
            }
        })
        .run(['$anchorScroll',
            function($anchorScroll) {
                $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
        }]);


    function HomeController($scope, $http, $location, $anchorScroll, UserService) {
        const vm = this;   
        $scope.goToAnchor = function(x) {
          if ($location.hash() !== x) {
            $location.hash(x);
          } else {
            $anchorScroll();
          }
        };
        $('#login').click(function(){
            if($('#username').val() === "" || $('#password').val() === ""){
                Materialize.toast("Missing Username or password",2500);
            }else{
                var username = $('#username').val(),
                password = $('#password').val();
                $http({
                    method: 'POST',
                    url: '/api/login',
                    data: { 
                        username: username, 
                        password: password
                    },
                    dataType: "JSON",
                }).then(function(data){
                    if(!data){
                        return Materialize.toast("Error in Logging in. Please try again!",2500);

                    }
                    $http({
                        method: 'GET',
                        url: '/api/getOneByID/'+data.data[0].CompanyID,
                        dataType: "JSON",
                    }).then(function(data1){
                        UserService.setCompanyID(data.data[0].CompanyID);
                        UserService.setUsername(username);
                        $location.url('/admin/companyinfo');
                        return Materialize.toast("Logging In...",2500);

                    },function(err){
                        return Materialize.toast("No company Found",2500);
                    });
                },function(err){
                    return Materialize.toast("Username or password unmatched",2500);
                });
            }
        });
    }
})();