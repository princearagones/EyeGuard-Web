(function(){

    'use strict';

    angular
        .module('app')
        .component('modifyReportComponent', {
            template: require('./modifyReport.html'),
            controller: ModifyReportController,
            bindings: {
            }
        });

    function ModifyReportController($scope, $http, UserService){
    	const vm = this;
        $http({
            method: 'GET',
            url: '/api/getReportType/'+UserService.getCompanyID(),
            dataType: "JSON",
        }).then(function(data){
            if(!data){
                return Materialize.toast("No Report Types Found",2500);
            }
            $scope.reportType = data.data;
        },function(err){
            return Materialize.toast("Error in getting report type",2500);
        });


        $('#addReportType').click(function(){
            if($scope.reportType >= 6){
                Materialize.toast("Reached maximum report type",2500);
            }else if($('#reportName').val() == "" || $('input[name=reportTypeGroup]:checked').val() == null){
                Materialize.toast("Lacking information to add report type", 2500);
            }else{
                console.log($('#reportName').val());
                console.log($('input[name=reportTypeGroup]:checked').val());
                var reportType = {
                    company_id: UserService.getCompanyID,
                    name: $('#reportName').val(),
                    image: $('input[name=reportTypeGroup]:checked').val()
                };
                 $http({
                    method: 'POST',
                    url: '/api/addReportType',
                    data: reportType,
                    dataType: "JSON"
                }).then(function(data1){
                    if(!data1){
                        return Materialize.toast("Error in adding Report Type",2500);
                    }else{
                        console.log(data1);
                        return Materialize.toast("Successfully added Report Type",2500);
                    }
                },function(err){
                    return Materialize.toast("Problem adding report type",2500)
                });

            }
        });

    }
})();
