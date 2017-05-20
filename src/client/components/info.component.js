(function(){

    'use strict';

    angular
        .module('app')
        .component('infoComponent', {
            template: require('./info.html'),
            controller: infoController,
            bindings: {
            }
        });
    function infoController($scope, $http, $location, UserService){
    	const vm = this;
        var date = "2017-05-19";
        var id = $location.path().split('/')[3];
        $http({
            method: 'GET',
            url: '/api/user/'+id,
            dataType: 'JSON'
        }).then(function(data){
            if(!data){
                return Materialize.Toast("No User info retrieved",2500);
            }
            $scope.FirstName = data.data[0].FirstName;
            $scope.LastName = data.data[0].LastName;
        },function(err){
            return Materialize.Toast("Error in getting User info",2500);
        })
        $http({
            method: 'GET',
            url: '/api/user/reports/'+id,
            dataType: 'JSON'
        }).then(function(data){
            if(!data){
                return Materialize.Toast("No reports retrieved",2500);
            }
            $scope.reports = data.data;
        },function(err){
            return Materialize.Toast("Error in getting reports",2500);
        })
        $http({
            method: 'GET',
            url: '/api/user/location/'+id+'/'+date,
            dataType: 'JSON'
        }).then(function(data){
            if(!data){
                return Materialize.Toast("Error in getting locations",2500);
            }
            $.getScript("https://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=initMap", function(){
          
                });
            //  $scope.locations = [];
            // for(var i = 0; i< data.data.length; i++){
                
            //         // console.log(data.data[i]);
            //     $scope.locations.push({
            //         "lat": data.data[i].Latitude,
            //         "lng": data.data[i].Longhitude
            //     })
            // }
            // // console.log($scope.locations);
        },function(err){
            return Materialize.Toast("Error in getting User info",2500);
        })
    }
})();

