(function() {

    'use strict';

    angular
        .module('app')
        .config(routerConfig)
        .service('UserService', function(){
            var user = {
            };
            return {
                user:function(){
                    return user;
                },
                setUsername: function(username){
                    user.username = username;
                },
                getUsername: function(){
                    return user.username;
                },
                setData: function(data){
                    user.data = data
                },
                getData: function(){
                    return user.data;
                },
                setCompanyID: function(id){
                    user.companyid = id;
                },
                getCompanyID: function(){
                    return user.companyid;
                },
                setRole: function(role){
                    user.role = role;
                },
                getRole: function(){
                    return user.role;
                }
            }
        });
    
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state({
                name: 'home',     
                url: '/',     
                component: 'homeComponent',           
            })

            .state({
                name: 'admin',
                url: '/admin',
                component: 'adminComponent'
            })

            .state({
                name: 'signup',
                url: '/signup',
                component: 'signupComponent'
            })  

            .state({
                name: 'signup.generate',
                url: '/generate',
                component: 'generateComponent'
            })  

            .state({
                name: 'signup.existing',
                url: '/existing',
                component: 'existingComponent'
            })   

            .state({
                name: 'admin.verify',
                url: '/verify',
                component: 'verifyComponent'
            })

            .state({
                name: 'admin.monitor',
                url: '/monitor',
                component: 'monitorComponent'
            })

            .state({
                name: 'admin.monitor.info',
                url: '/:id',
                component: 'infoComponent'
            })

            .state({
                name: 'admin.companyinfo',
                url: '/companyinfo',
                component: 'companyinfoComponent'
            })

        $urlRouterProvider.otherwise('/');
    }
})();
