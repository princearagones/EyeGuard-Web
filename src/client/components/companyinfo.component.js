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
                        $scope.guards = new Array();
                        $scope.guards = data.data;
                        $scope.guards.sort(compare);
                        for(var i = 0; i < $scope.companyReports.length; i++){
                            for(var j = 0 ; j < $scope.guards.length; j++){
                                if($scope.companyReports[i].UserID == $scope.guards[j].ID){
                                    $scope.companyReports[i].userName = $scope.guards[j].LastName + ", "+ $scope.guards[j].FirstName;
                                }
                            }
                        }
                        $scope.updateLocation();
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

        $scope.showPath = true;
        $scope.showReport = true;
        $scope.time_change = false;
        $scope.coloredMarkers = [];
        $scope.reportMarkers = [];
        $scope.coloredPaths = [];

        $("#time_from").change(function(){
            $scope.time_change = true;
            // console.log(time_change);
            $scope.updateLocation();
            // console.log(time_change);

        });

        $("#time_to").change(function(){
            $scope.time_change = true;
            $scope.updateLocation();
        });

        $("#time_to").change(function(){
            $scope.time_change = true;
            $scope.updateLocation();
        });

        $("#showPath").change(function(){
            $scope.showPath = ($('#showPath').is(':checked'));
            $scope.updateLocation();
        });

        $("#showReport").change(function(){
            $scope.showReport = ($('#showReport').is(':checked'));
            $scope.updateLocation();
        });


        function showReportMarker(reports, map, paths,markers){
        for(var i=0; i<reports.length;i++){
            if (reports[i].DateSubmitted.split("T")[0] == $('#date').val()){
                console.log(reports[i]);
                console.log(paths[reports[i].UserID]);
                for(var j=0;j<paths[reports[i].UserID].length-1;j++){
                    
                    // console.log(paths[reports[i].UserID][j]);
                    // console.log((reports[i].DateSubmitted));
                    // console.log((paths[reports[i].UserID][j].Time));
                    if(getTime(reports[i].DateSubmitted) > getTime(paths[reports[i].UserID][j].Time) &&
                        getTime(reports[i].DateSubmitted) < getTime(paths[reports[i].UserID][j+1].Time)){
                        console.log($scope.guards);
                        var reporter;
                        for(var k = 0; k<$scope.guards.length;k++){
                            if($scope.guards[k].ID == reports[i].UserID){
                                reporter = $scope.guards[k].LastName + ", "+ $scope.guards[k].FirstName;
                                break;
                            }
                        }
                        var contentString = '<div id="content">'+
                        '<div id="siteNotice">'+
                        '</div>'+
                        '<h3 id="firstHeading" class="firstHeading">'+reports[i].Type +'</h3>'+
                        '<div id="bodyContent">'+
                        '<p><b>Location Name:</b>'+reports[i].LocationName+'</p>'+
                        '<p><b>Date:</b>'+reports[i].DateSubmitted+'</p>'+
                        '<p><b>Remarks:</b>'+reports[i].Remarks+'</p>'+
                        '<p><b>Reported by :</b>'+reporter+'</p>'+
                        '</div>'+
                        '</div>';

                        var infowindow = new google.maps.InfoWindow({
                          content: contentString,
                          maxHeight: 200
                        });
                        console.log(paths[reports[i].UserID][j]);
                        var reportMark = new google.maps.Marker();
                          // position: new google.maps.LatLng(paths[reports[i].UserID][j].Latitude,paths[reports[i].UserID][j].Longhitude);
                          // position: new google.maps.LatLng( 14.1646151,121.2421228)
                        reportMark.setPosition(new google.maps.LatLng(paths[reports[i].UserID][j].Latitude,paths[reports[i].UserID][j].Longhitude));
                        reportMark.setMap(map);
                        reportMark.addListener('click', function() {
                          infowindow.open(map, reportMark);
                        });
                        markers.push(reportMark);
                        break;
                    }
                }
            }
        }
     }



        $scope.updateLocation = function(){
            var date = $('#date').val();
            var color = ["#1EA362","#FFE047","#4A89F3","#DD4B3E","#822F2B"];
            var iconPath = "/public/images/gMapIcons/";
            var iconColors = ["brown","red", "orange", "yellow","paleblue","blue","green","darkgreen","pink","purple"];
            $scope.cur_date = date;
            console.log("time_change is "+$scope.time_change);

           NgMap.getMap({id:'map1'}).then(function(map) {
                       $scope.mainMap = map;
                       for(i = 0;i< $scope.coloredPaths.length;i++){
                                $scope.coloredPaths[i].setMap(null);
                        }
                        for(var i = 0; i< $scope.coloredMarkers.length;i++){
                            for(var j=0; j< $scope.coloredMarkers[i].length;j++){
                                    $scope.coloredMarkers[i][j].setMap(null);
                            }
                        }
                         for(i = 0;i< $scope.reportMarkers.length;i++){
                                $scope.reportMarkers[i].setMap(null);
                        }
                        $scope.coloredMarkers = [];
                        $scope.coloredPaths = [];
                        $scope.reportMarkers = [];
                });
            $http({
                method: 'GET',
                url: '/api/location/getByCompany/'+UserService.getCompanyID()+'/'+date,
                dataType: 'JSON'
            }).then(function(data){
                if(!data){
                    return Materialize.Toast("Error in getting locations",2500);
                }
            
                // $scope.locations = [];
                $scope.paths = _.groupBy(data.data,"UserID"); //sorts location plots by users
                if(data.data[0] != undefined){ //gets the center of the map
                    $scope.center = [data.data[0].Latitude,data.data[0].Longhitude]; 
                }

                $scope.patrolsPresent = new Array()
                for(var i=0;i<Object.keys($scope.paths).length;i++){
                    // console.log(Object.keys($scope.paths)[i]); //userIDs
                    var userID = Object.keys($scope.paths)[i];
                    var obj = findObjectByKey($scope.guards, 'ID', userID);
                    obj.iconSrc = new Image().src = iconPath + iconColors[i%iconColors.length]+ "_MarkerA.png"; //assign icon_image

                    $scope.patrolsPresent.push(obj);
                }
                console.log($scope.patrolsPresent);
                if(data.data.length == 0){
                    $('#noLocMsg').show();
                    $('#map1').hide();
                }else{
                    $('#noLocMsg').hide();
                    $('#map1').show();
 

                    if($scope.time_change == false){
                        var time_from = addTimes(data.data[0].Time.split("T")[1].split("Z")[0],"08:00:00" );
                        var time_to = addTimes(data.data[data.data.length-1].Time.split("T")[1].split("Z")[0],"08:00:00" );
                        $("#time_from").val(time_from);
                        $("#time_to").val(time_to);
                    }
                    
                    console.log($scope.paths);
                    var pathCoordinates = new Array();
                    for(var j = 0; j<Object.keys($scope.paths).length;j++){
                         var coordinates = new Array();
                         var colorMarker = new Array();
                        for(i=0;i<$scope.paths[Object.keys($scope.paths)[j]].length;i++){  
                            if(!$scope.time_change){
                                var point =new google.maps.LatLng($scope.paths[Object.keys($scope.paths)[j]][i].Latitude,$scope.paths[Object.keys($scope.paths)[j]][i].Longhitude);
                                coordinates.push(point); 
                            }else {
                                // console.log( addTimes($scope.paths[Object.keys($scope.paths)[j]][i].Time.split("T")[1].split("Z")[0], "08:00:00" ) +" , "+$("#time_to").val());
                                if(addTimes($scope.paths[Object.keys($scope.paths)[j]][i].Time.split("T")[1].split("Z")[0],"08:00:00" ) <= $("#time_to").val() &&
                                    addTimes($scope.paths[Object.keys($scope.paths)[j]][i].Time.split("T")[1].split("Z")[0],"08:00:00" ) >= $("#time_from").val()){
                                     var point =new google.maps.LatLng($scope.paths[Object.keys($scope.paths)[j]][i].Latitude,$scope.paths[Object.keys($scope.paths)[j]][i].Longhitude);
                                        coordinates.push(point); 
                                        console.log("location in");
                                }else{
                                    console.log("rejected a location");
                                }
                            }
                        }   
                        for(i = 0;i< coordinates.length;i++){
                            if($scope.showPath){
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
                        }
                        pathCoordinates.push(coordinates);
                        $scope.coloredMarkers.push(colorMarker);
                    }

                    NgMap.getMap({id:'map1'}).then(function(map) {
                        if($scope.showReport)showReportMarker($scope.companyReports,map,$scope.paths,$scope.reportMarkers);
                        for(var i = 0; i< $scope.coloredMarkers.length;i++){
                            console.log($scope.coloredMarkers[i].length);
                            for(var j=0; j< $scope.coloredMarkers[i].length;j++){
                                    $scope.coloredMarkers[i][j].setMap(map);
                            }
                        }
                    });
                    for(i = 0; i< pathCoordinates.length;i++){
                        var flightPath = new google.maps.Polyline({
                         path: pathCoordinates[i],
                         geodesic: true,
                         strokeColor: iconColors[i%iconColors.length],
                         strokeOpacity: 1.0,
                         strokeWeight: 2
                         });
                        $scope.coloredPaths.push(flightPath);
                    }


                     NgMap.getMap({id:'map1'}).then(function(map) {
                            for(i = 0;i< $scope.coloredPaths.length;i++){
                                $scope.coloredPaths[i].setMap(map);
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
    }
     function findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == value) {
                return array[i];
            }
        }
        return null;
    }


     function getDate(timestamp){
        return(timestamp.split("T")[0]);
     }
     function getTime(timestamp){
        return(timestamp.split("T")[1]);
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

      var hours = times[0] % 24
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