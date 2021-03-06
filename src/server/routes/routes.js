'use strict'

const express = require('express');
const importer = require('anytv-node-importer');

module.exports = (router) => {

    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;
    router.post('/api/login',							    __.user.login);
    router.post('/api/logout',						    	__.user.logout);
    router.get('/api/user/:user_id', 				       	__.user.getOne);
    router.get('/api/user/location/:user_id/:date',     	__.user.getLocation);
    router.get('/api/user/reports/:user_id', 		     	__.user.getReport);
    router.get('/api/user/username/:username', 			      __.user.getOneByUsername);
    router.put('/api/user/validate', 					    __.user.validate);
    router.post('/api/user/add', 						    __.user.add);
    router.post('/api/user/delete',					        __.user.remove);

    router.get('/api/report/getRecentByCompany/:company_id',       __.report.getRecentByCompany);
    router.get('/api/getReportType/:company_id',                   __.report.getReportType);
    router.post('/api/report/add',                                 __.report.add);
    router.post('/api/addReportType',                              __.report.addReportType);
    router.put('/api/editReportType/:id',                          __.report.editReportType);
    router.del('/api/deleteReportType/:id',                     __.report.deleteReportType);

    router.post('/api/location/add',                               __.location.add);
    router.get('/api/location/getByCompany/:company_id/:date',     __.location.getByCompany);

    router.post('/api/android/login',					__.user.loginAndroid);

    router.get('/api/getUnverifiedUsers/:id',			__.admin.getUnverifiedUsers);
    router.get('/api/getUsers/:id',						__.admin.getUsers);
    router.post('/api/admin/add',						__.admin.add);

    router.get('/api/getCompanyByUsername',				__.company.getCompanyByUsername);
    router.get('/api/getOneByCode/:code',				__.company.getOneByCode);
    router.get('/api/getOneByID/:id',					__.company.getOneByID);
    router.get('/api/companyAllCode',					__.company.getAllCode);
    router.get('/api/company/:company_name',			__.company.getOneByUsername);
    router.post('/api/company/add',						__.company.add);


    router.get('/dashboard',							__.user.checkSession);


    return router;

};  