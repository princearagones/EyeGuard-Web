var db = require(__dirname + './../database/mysql')

'use strict';

exports.add = function(req,res,next){
	db.query("INSERT INTO Report (Type, Remarks, LocationName, LocationID, UserID) VALUES (?,?,?,?,?)",
		[req.body.type, req.body.remarks, req.body.locationname, req.body.locationid, req.body.userid],
		function(err,rows){
			if(err){
				console.log(req, "ERROR", "Cannot add report");
				return next(err);
			}
			console.log("SUCCESS", "Added report");
			res.send(rows);
		}
	);
}
