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
    function infoController($scope, $http, $location, UserService,NgMap){
      //   $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCYSR_J1o3j7I_fsPGkY96Vj9dZhW5k1h8"
      //   NgMap.getMap().then(function(map) {
      //   console.log(map.getCenter());
      //   console.log('markers', map.markers);
      //   console.log('shapes', map.shapes);
      //   vm
      // });
      const vm = this;
      var markers;

      

        $scope.locations = [];
        var infoWindow = new google.maps.InfoWindow();

          NgMap.getMap().then(function(map) {
            vm.map = map;
            markers = map.markers;
        // console.log(map.getCenter());
        // console.log('markers', map.markers);
        // console.log('shapes', map.shapes);
          });

        $scope.zoomToIncludeMarkers = function() {
              var bounds = new google.maps.LatLngBounds();
             locations.forEach(function(c) {
                var latLng = new google.maps.LatLng(c[0],c[1]);
                bounds.extend(latLng);
              });
              $scope.map.fitBounds(bounds);
              if(locations.length == 1){
                 $scope.map.setZoom(5);
              }
          };

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
                $scope.viewableReports = data.data;
            },function(err){
                return Materialize.Toast("Error in getting reports",2500);
            })
         //2017-05-19
         $scope.updateReport = function(){
            var date = $('#date_request').val();
            var type = $('#type_request').val();
            var location = $('#location_request').val();
            $scope.viewableReports = [];
            if (type.length == 0 && date=="All" && location=="All"){ //all
                $scope.viewableReports = $scope.reports;
            }
            else{
                var reports = [];
                if(type.length !=0){
                    for(var i=0;i<$scope.reports.length;i++){
                        for(var j=0;j<type.length;j++){
                            if($scope.reports[i].Type == type[j]){
                              reports.push($scope.reports[i]);
                              break;  
                            } 
                        }
                    }  
                }
                else{
                     reports =  $scope.reports;
                }
                if(location !="All"){
                    var locReports = [];
                    for(var i=0;i<reports.length;i++){
                        if(reports[i].LocationName.toLowerCase() == location.toLowerCase()){
                            locReports.push(reports[i]);
                        }
                    }
                    reports = locReports;
                }
                if(date !="All"){
                    var dateReports = [];
                    console.log(reports);
                    for(var i=0;i<reports.length;i++){
                        if(reports[i].DateSubmitted.split("T")[0] == date){
                            dateReports.push(reports[i]);
                        }

                    }
                    reports = dateReports;
                }
            $scope.viewableReports = reports;
            }
         }

         function addTimes (startTime, endTime) {
              var times = [ 0, 0, 0 ]
              var max = times.length

              var a = (startTime || '').split(':')
              var b = (endTime || '').split(':')

              // normalize time values
              for (var i = 0; i < max; i++) {
                a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
                b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
              }

              var res = (minutes / 60) | 0;
            hours += res;
            minutes = minutes - (60 * res);
              // store time values
              for (var i = 0; i < max; i++) {
                times[i] = a[i] + b[i]
              }

              var hours = times[0]
              var minutes = times[1]
              var seconds = times[2]

              if (seconds >= 60) {
                var m = (seconds / 60) << 0
                minutes += m
                seconds -= 60 * m
              }

              if (minutes >= 60) {
                var h = (minutes / 60) << 0
                hours += h
                minutes -= 60 * h
              }

              return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
            }

        $scope.updateData = function(){
             var date = $('#date').val();
            
            $http({
                method: 'GET',
                url: '/api/user/location/'+id+'/'+date,
                dataType: 'JSON'
            }).then(function(data){
                if(!data){
                    return Materialize.Toast("Error in getting locations",2500);
                }
                // $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCYSR_J1o3j7I_fsPGkY96Vj9dZhW5k1h8&v=3&sensor=false&callback=initMap", function(){
              
                //     });
                 $scope.locations = [];
                for(var i = 0; i< data.data.length; i++){
                    var arr = [];
                    arr.push(data.data[i].Latitude);
                    arr.push(data.data[i].Longhitude);
                    arr.push(data.data[i].Time);
                        // console.log(data.data[i]);
                    $scope.locations.push(arr);
                }
                // console.log($scope.locations[0][0]);
                // console.log($scope.locations[0][1]);
                if($scope.locations.length == 0){
                    $('#noLocMsg').show();
                    $('#map1').hide();
                }else{
                    $('#noLocMsg').hide();
                    $('#map1').show();
                    console.log($scope.locations);
                    console.log("check");
                    // var map = new google.maps.Map(document.getElementById('map1'));
                    // google.maps.event.trigger(map, 'resize');
                    // var map = new google.maps.Map(document.getElementById("map1"), mapOptions);
                    // console.log("check");
                    //      infoWindow.setContent(contentString);
                    // infoWindow.setPosition(event.latLng);
                    // zoomToIncludeMarkers();
                    // infoWindow.open(vm.map);
                    $scope.markers = [];
                    for (var i = 0; i < $scope.locations.length;i++){
                        var loc = {
                            id: i, lat: $scope.locations[i][0], lng: $scope.locations[i][1], time: $scope.locations[i][2]
                        }
                        $scope.markers.push(loc);
                    }
                    $scope.markers.sort(compare);
                    console.log($scope.markers);
                    $scope.path =  $scope.markers.map(function(marker){
                        return [marker.lat,marker.lng];
                    });
                    var time_from = addTimes($scope.markers[0].time.split("T")[1].split("Z")[0],"08:00:00" );
                    var time_to = addTimes($scope.markers[$scope.markers.length-1].time.split("T")[1].split("Z")[0],"08:00:00" );
                    $("#time_from").val(time_from);
                    $("#time_to").val(time_to);
                
                    // console.log($scope.markers[$scope.markers.length].time);

                     NgMap.getMap({id:'map1'}).then(function(map) {
                          google.maps.event.trigger(map, 'resize');
                    });

                     function compare(a,b) {
                      if (a.time < b.time)
                        return -1;
                      if (a.time > b.time)
                        return 1;
                      return 0;
                    }

                }
              //    vm.showArrays = function(event) {

              //   // Since this polygon has only one path, we can call getPath()
              //   // to return the MVCArray of LatLngs.
              //   var vertices = this.getPath();

              //   var contentString = '<b>Bermuda Triangle polygon</b><br>' +
              //       'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
              //       '<br>';

              //   // Iterate over the vertices.
              //   for (var i =0; i < vertices.getLength(); i++) {
              //     var xy = vertices.getAt(i);
              //     contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
              //         xy.lng();
              //   }

              //   // Replace the info window's content and position.
              //   infoWindow.setContent(contentString);
              //   infoWindow.setPosition(event.latLng);
              //   zoomToIncludeMarkers();
              //   infoWindow.open(vm.map);
              // }

            },function(err){
                return Materialize.Toast("Error in getting User info",2500);
            })
            // console.log($scope.locations.length);
            // console.log("change");
        } 
        $scope.updateData();
        // $("#changeDate").on("click", updateValues());
        // console.log("whut");

    }
})();

