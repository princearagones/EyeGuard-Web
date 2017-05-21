(function(){

    'use strict';

    angular
        .module('app')
        .component('generateComponent', {
            template: require('./generate.html'),
            controller: GenerateController,
            bindings: {
            }
        });
        
    function GenerateController($scope, $http, $location) {
        const vm = this;   
    }
})();