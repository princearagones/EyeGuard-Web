'use strict'

const express = require('express');
const importer = require('anytv-node-importer');

module.exports = (router) => {

    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;
    router.post('/api/login',							__.user.login);
    router.post('/api/logout',							__.user.logout);
    router.get('/api/user/:user_id', 					__.user.getOne);

    router.get('/dashboard',							__.user.checkSession);


    return router;

};  