var db = require(__dirname + './../database/mysql')

'use strict';

exports.add = function(req,res,next){
	db.query("INSERT INTO Location (Time, Latitude, Longhitude, UserID, isReport) VALUES (?,?,?,?,?)",
		[req.body.time, req.body.latitude, req.body.longhitude, req.body.userid, req.body.isreport],
		function(err,rows){
			if(err){
				console.log(req, "ERROR", "Cannot add location");
				return next(err);
			}
			console.log("SUCCESS", "Added location");
			res.send(rows);
		}
	);
}

exports.getByCompany = function(req, res, next){
	db.query("SELECT * FROM Location WHERE UserID IN (SELECT ID FROM User WHERE CompanyID = ?) AND Time LIKE CONCAT(?,'%')",
        [req.params.company_id, req.params.date],
        function (err, rows) {
            if (err) {
                console.log(req, "ERROR", "MySQL Query Error");
                return next(err);
            }
            if (rows.length === 0) {
                console.log(req, "ERROR", "Error: Locations not found");
                res.send(rows);
            } else {
                console.log(req, "SUCCESS", "RETRIEVED details of locations");
                res.send(rows);
            }
        }
    );
}
