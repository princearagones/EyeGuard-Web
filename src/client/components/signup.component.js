(function(){

    'use strict';

    angular
        .module('app')
        .component('signupComponent', {
            template: require('./signup.html'),
            controller: SignupController,
            bindings: {
            }
        });


    function SignupController($scope, $http, $location) {
        const vm = this;   

        function randomString(length) {
            var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        $('#submit_signup').click(function(){
            if($('#username').val() === ""){
                Materialize.toast("Please enter Username",2500);
            }
            if($('#firstName').val() === ""){
                Materialize.toast("Please enter First Name",2500);
            }
            if($('#lastName').val() === ""){
                Materialize.toast("Please enter Last Name",2500);
            }
            if($('#email').val() === ""){
                Materialize.toast("Please enter E-mail",2500);
            }
            if($('#companyName').val() === "" || $('#companyCode').val() === ""){
                Materialize.toast("Please enter Company Code or Name",2500);
            }
            if($('#password').val() === ""){
                Materialize.toast("Please enter Password",2500);
            }
            if($('#password').val() != $('#repassword').val() ){
                Materialize.toast("Password did not matched",2500);
            }
            else{
                var username = $('#username').val(),
                password = $('#password').val(),
                firstName = $('#firstName').val(),
                lastName = $('#lastName').val(),
                companyName = $('#companyName').val(),
                companyCode = $('#companyCode').val(),
                email = $('#email').val();
                if(companyName !== undefined){
                    var temp_code = randomString(7);
                    $http({
                        method: 'GET',
                        url: '/api/companyAllCode',
                        dataType: "JSON"
                    }).then(function(data){
                        var flag_code = true;
                        if(data.data[0]){
                            while(flag_code){
                                flag_code = false;
                                for(var d in data.data){
                                    if(d.code === temp_code){
                                        temp_code = randomString(7);
                                        flag_code = true;
                                        break;
                                    }
                                }
                            }    
                        }
                    })

                    $http({
                        method: 'GET',
                        url: '/api/user/username/' + username,
                        dataType: "JSON"
                    }).then(function(data){
                        if(!data.data[0]){
                            $http({
                                method: 'GET',
                                url: '/api/company/' + companyName,
                                dataType: "JSON"
                            }).then(function(data2){
                                if(!data2.data[0]){
                                    $http({
                                        method: 'POST',
                                        url: '/api/company/add',
                                        data:{
                                            name: companyName,
                                            code: temp_code
                                        },
                                        dataType: "JSON"
                                    }).then(function(data3){
                                        if(!data3){
                                            return Materialize.toast("Error in adding Company",2500);
                                        }else{
                                            var admin = {
                                                lastname: lastName,
                                                firstname: firstName,
                                                username: username,
                                                password: password,
                                                email: email,
                                                companyid: data3.data.insertId,
                                                issuperadmin: true
                                            }
                                            console.log(admin);
                                            $http({
                                                method: 'POST',
                                                url: '/api/admin/add',
                                                data: admin,
                                                dataType: "JSON"
                                            }).then(function(data4){
                                                if(!data4){
                                                    return Materialize.toast("Error in adding Admin",2500);
                                                }else{
                                                    console.log(data4);
                                                     window.location.assign("/");
                                                    return Materialize.toast("Successfully registered as Super Admin",2500);
                                                }
                                            },function(err){
                                                return Materialize.toast("Problem adding admin",2500)
                                            });
                                        }
                                    },function(err){
                                        return Materialize.toast("Problem adding company",2500);
                                    });
                                }else{
                                    return Materialize.toast("Company Name already taken",2500); 
                                }
                            }),function(err){
                                return Materialize.toast("Problem query with Company Name",2500);
                            }
                        }
                        else{
                            return Materialize.toast("Username already taken",2500);   
                        }
                    },function(err){
                        return Materialize.toast("Problem query with username",2500);
                    });
                }
                else if(companyCode != undefined){
                    console.log("Using existing company");
                    $http({
                        method: 'GET',
                        url: '/api/getOneByCode/' + companyCode,
                        dataType: "JSON"
                    }).then(function(data){
                        console.log(data);
                        if(data.data && confirm("Are you sure you want to apply for "+data.data.Name+"?" ) == true){
                            var admin = {
                                lastname: lastName,
                                firstname: firstName,
                                username: username,
                                password: password,
                                email: email,
                                companyid: data.data.ID,
                                issuperadmin: false
                            };
                            $http({
                                method: 'POST',
                                url: '/api/admin/add',
                                data: admin,
                                dataType: "JSON"
                            }).then(function(data1){
                                if(!data1){
                                    return Materialize.toast("Error in adding Admin",2500);
                                }else{
                                    console.log(data1);
                                    window.location.assign("/");
                                    return Materialize.toast("Successfully registered as Admin",2500);
                                }
                            },function(err){
                                return Materialize.toast("Problem adding admin",2500)
                            });
                        }
                        else return Materialize.toast("Company does not exist",2500);
                    });
                }
                else{
                    Materialize.toast("Choose between Generate Company Code or Use Existing Company Code",2500);
                }
            }
        });
    }
})();