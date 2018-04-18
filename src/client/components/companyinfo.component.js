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
    function companyinfoController($scope, $http,$filter, UserService,NgMap){
    	const vm = this;
        $http({
            method: 'GET',
            url: '/api/getCompanyByUsername',
            dataType: 'JSON'
        }).then(function(data){
            if(!data){
                return Materialize.Toast("No Company ID retrieved",2500);
            }
            UserService.setCompanyID(data.data.CompanyID);
            $http({
                method: 'GET',
                url: '/api/getOneByID/'+UserService.getCompanyID(),
                dataType: "JSON",
            }).then(function(data){
                if(!data){
                    return Materialize.toast("No Company found",2500);
                }
                $scope.companyName = data.data.Name;
                $scope.companyCode = data.data.Code;
                $http({
                    method: 'GET',
                    url: '/api/report/getRecentByCompany/'+UserService.getCompanyID(),
                    dataType: "JSON",
                }).then(function(data){
                    if(!data){
                        return Materialize.toast("No Reports found",2500);
                    }
                    $scope.companyReports = data.data;
                    $scope.companyReports.sort(compareDate);
                    $scope.companyReports = $scope.companyReports.splice(0,10);
                    $http({
                        method: 'GET',
                        url: '/api/getUsers/'+UserService.getCompanyID(),
                        dataType: "JSON",
                    }).then(function(data){
                        if(!data){
                            return Materialize.toast("No Verified users",2500);
                        }
                        $scope.guards = data.data;
                        $scope.guards.sort(compare);
                        for(var i = 0; i < $scope.companyReports.length; i++){
                            for(var j = 0 ; j < $scope.guards.length; j++){
                                if($scope.companyReports[i].UserID == $scope.guards[j].ID){
                                    $scope.companyReports[i].userName = $scope.guards[j].LastName + ", "+ $scope.guards[j].FirstName;
                                }
                            }
                        }
                    },function(err){
                        return Materialize.toast("Error in getting verified users. Please try again!",2500);
                    });
                },function(err){
                    return Materialize.toast("Error in getting Company. Please try again!",2500);
                });
                $http({
                    method: 'GET',
                    url: '/api/getUsers/'+UserService.getCompanyID(),
                    dataType: "JSON",
                }).then(function(data){
                    if(!data){
                        return Materialize.toast("No Verified users",2500);
                    }
                    $scope.guards = data.data;
                    $scope.guards.sort(compare);
                    // console.log($scope.guards);
                },function(err){
                    return Materialize.toast("Error in getting verified users. Please try again!",2500);
                });
            },function(err){
                return Materialize.toast("Error in getting Company. Please try again!",2500);
            });
        },function(err){
            return Materialize.Toast("Error in getting Company ID",2500);
        });


        $scope.updateLocation = function(){
            var date = $('#date').val();
            var color = ["#1EA362","#FFE047","#4A89F3","#DD4B3E","#822F2B"];
            var iconPath = "/public/images/gMapIcons/";
            var iconColors = ["brown","red", "orange", "yellow","paleblue","blue","green","darkgreen","pink","purple"];
            $scope.cur_date = date;


           NgMap.getMap({id:'map1'}).then(function(map) {
                       $scope.mainMap = map;
                });
            $http({
                method: 'GET',
                url: '/api/location/getByCompany/'+UserService.getCompanyID()+'/'+date,
                dataType: 'JSON'
            }).then(function(data){
                if(!data){
                    return Materialize.Toast("Error in getting locations",2500);
                }
            
                $scope.locations = [];
                $scope.paths = _.groupBy(data.data,"UserID");

                $scope.patrolsPresent = new Array()
                for(var i=0;i<Object.keys($scope.paths).length;i++){
                    // console.log(Object.keys($scope.paths)[i]); //userIDs
                    var userID = Object.keys($scope.paths)[i];
                    // $scope.guards;
                    var obj = findObjectByKey($scope.guards, 'ID', userID);
                    obj.iconSrc = new Image().src = iconPath + iconColors[i%iconColors.length]+ "_MarkerA.png";
                    $scope.patrolsPresent.push(obj);
                }
                console.log($scope.patrolsPresent);

                for(var i = 0; i< data.data.length; i++){
                    var arr = [];
                    arr.push(data.data[i].Latitude);
                    arr.push(data.data[i].Longhitude);
                    arr.push(data.data[i].Time);
                    arr.push(data.data[i].UserID);
                    $scope.locations.push(arr);
                }
                if($scope.locations.length == 0){
                    $('#noLocMsg').show();
                    $('#map1').hide();
                }else{
                    $('#noLocMsg').hide();
                    $('#map1').show();
 
                    $scope.markers = [];
                    for (var i = 0; i < $scope.locations.length;i++){
                        var loc = {
                            id: i, lat: $scope.locations[i][0], lng: $scope.locations[i][1], time: $scope.locations[i][2]
                        }
                        $scope.markers.push(loc);
                    }
                    $scope.markers.sort(compare);
                    $scope.path =  $scope.markers.map(function(marker){
                        return [marker.lat,marker.lng];
                    });
                    var time_from = addTimes($scope.markers[0].time.split("T")[1].split("Z")[0],"08:00:00" );
                    var time_to = addTimes($scope.markers[$scope.markers.length-1].time.split("T")[1].split("Z")[0],"08:00:00" );
                    $("#time_from").val(time_from);
                    $("#time_to").val(time_to);

                    var pathCoordinates = new Array();
                    var coloredMarkers = new Array();
                    for(var j = 0; j<Object.keys($scope.paths).length;j++){
                         var coordinates = new Array();
                         var colorMarker = new Array();
                        for(i=0;i<$scope.paths[Object.keys($scope.paths)[j]].length;i++){  
                          var point =new google.maps.LatLng($scope.paths[Object.keys($scope.paths)[j]][i].Latitude,$scope.paths[Object.keys($scope.paths)[j]][i].Longhitude);
                          coordinates.push(point);   
                        }   
                        for(i = 0;i< coordinates.length;i++){
                            var beachMarker = new google.maps.Marker({
                              position: coordinates[i],
                              icon: new Image().src = iconPath + iconColors[j%iconColors.length]+ "_MarkerA.png",
                            });
                            // var infoWindow = new google.maps.InfoWindow();
                            // google.maps.event.addListener(beachMarker, 'mouseover', function() {
                            //     infoWindow.setContent(j.toString());
                            //     infoWindow.open($scope.map, beachMarker);
                            //     });
                            // google.maps.event.addListener(beachMarker, 'mouseout', function() {infoWindow.close();});
                            colorMarker.push(beachMarker);
                        }
                        pathCoordinates.push(coordinates);
                        coloredMarkers.push(colorMarker);
                    }

                    NgMap.getMap({id:'map1'}).then(function(map) {
                        for(var i = 0; i< coloredMarkers.length;i++){
                            for(var j=0; j< coloredMarkers[i].length;j++){
                                    coloredMarkers[i][j].setMap(map);
                                    var marker = coloredMarkers[i][j];
                                    
                            }
                        }
                    });

                    var coloredPaths = new Array();
                    for(i = 0; i< pathCoordinates.length;i++){
                        var flightPath = new google.maps.Polyline({
                         path: pathCoordinates[i],
                         geodesic: true,
                         strokeColor: iconColors[i%iconColors.length],
                         strokeOpacity: 1.0,
                         strokeWeight: 2
                         });
                        coloredPaths.push(flightPath);
                    }


                     NgMap.getMap({id:'map1'}).then(function(map) {
                            for(i = 0;i< coloredPaths.length;i++){
                                coloredPaths[i].setMap(map);
                            }
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


            },function(err){
                return Materialize.Toast("Error in getting User info",2500);
            })
        } 
        $scope.updateLocation();
    }
     function findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == value) {
                return array[i];
            }
        }
        return null;
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
     function compare(a,b) {
      if (a.LastName+a.FirstName < b.LastName+b.FirstName)
        return -1;
      if (a.LastName+a.FirstName > b.LastName+b.FirstName)
        return 1;
      return 0;
    }
    function compareDate(a,b) {
      if (a.DateSubmitted+a.DateSubmitted > b.DateSubmitted+b.DateSubmitted)
        return -1;
      if (a.DateSubmitted+a.DateSubmitted < b.DateSubmitted+b.DateSubmitted)
        return 1;
      return 0;
    }
})();