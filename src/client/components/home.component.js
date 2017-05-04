(function(){

    'use strict';

    angular
        .module('app')
        .component('homeComponent', {
            template: require('./home.html'),
            controller: HomeController,
            bindings: {
            }
        });

    function HomeController($scope, $http) {
        const vm = this;   
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
                },function(err){
                    return Materialize.toast(err.responseText,2500);
                });
                //     url: '/api/login',
                //     method: 'POST',
                //     headers: util.headers,
                //     data: {
                //         username: username;
                //         password: password;
                //     },
                //     dataType: "JSON",
                //     success: function(data){
                //         if(!data){
                //             return Materialize.toast("Error in Logging in. Please try again!",2500);
                //         }

                //         // $('#' + emp_num).remove();
                //         return Materialize.toast("Successfully logging in",2500,"",function(){
                //             //return window.location.href = "/views/admin/";
                //         });
                //     },
                //     error: function(err){
                //         return Materialize.toast(err.responseText,2500);
                //     }
                // });
            }
        });
    }
})();