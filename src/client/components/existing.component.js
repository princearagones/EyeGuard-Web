(function(){

    'use strict';

    angular
        .module('app')
        .component('existingComponent', {
            template: require('./existing.html'),
            controller: ExistingController,
            bindings: {
            }
        });


    function ExistingController($scope, $http, $location) {
        const vm = this;   
    }
})();