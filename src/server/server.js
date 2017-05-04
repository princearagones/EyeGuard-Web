'use strict'

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
var session = require('express-session');

//server directory
app.use(express.static(__dirname + '/../../dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('info:', 'Setting up sessions...');
app.use( 
	session({
	    secret: '3y3Gu@rd',
	    name: 'puhrince',
	    resave: false,
	    saveUninitialized: true,
	    cookie: {
			maxAge: 7200000 //2 hours
	    }
 	})
);

app.use('/public',express.static(__dirname+"./../client/public"));
app.use('/', require(__dirname + '/routes/routes.js')(express.Router()));

app.get('/', function(req, res) {
	res.sendFile(path.resolve('./dist/index.html'));
});

app.listen(8000, function(){
	console.log('Server running at localhost:8000');
});
