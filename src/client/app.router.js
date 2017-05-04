(function() {

    'use strict';

    angular
        .module('app')
        .config(routerConfig);
    
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state({
                name: 'home',     
                url: '/',     
                component: 'homeComponent',           
            });

        $urlRouterProvider.otherwise('/');

    }

})();
