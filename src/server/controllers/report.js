var db = require(__dirname + './../database/mysql')

'use strict';

exports.add = function(req,res,next){
	db.query("INSERT INTO Report (Type, Remarks, LocationName, LocationID, DateSubmitted,  UserID) VALUES (?,?,?,?,?,?)",
		[req.body.type, req.body.remarks, req.body.locationname, req.body.locationid, req.body.datesubmitted, req.body.userid],
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

exports.getRecentByCompany = function(req, res, next){
	db.query("SELECT * FROM Report WHERE UserID in (SELECT ID FROM User where CompanyID = ?)  ORDER BY DateSubmitted",
        [req.params.company_id],
        function (err, rows) {
            if (err) {
                console.log(req, "ERROR", "MySQL Query Error");
                return next(err);
            }
            if (rows.length === 0) {
                console.log(req, "ERROR", "Error: Company "+req.params.company_id+" not found");
                res.send(rows);
            } else {
                console.log(req, "SUCCESS", "RETRIEVED details of "+req.params.company_id);
                res.send(rows);
            }
        }
    );
}

exports.getReportType = function(req, res, next){
	db.query("SELECT * FROM ReportType WHERE CompanyID = ?",
        [req.params.company_id],
        function (err, rows) {
            if (err) {
                console.log(req, "ERROR", "MySQL Query Error");
                return next(err);
            }
            if (rows.length === 0) {
                console.log(req, "ERROR", "Error: Company "+req.params.company_id+" not found");
                res.send(rows);
            } else {
                console.log(req, "SUCCESS", "RETRIEVED report types of "+req.params.company_id);
                res.send(rows);
            }
        }
    );
}

exports.addReportType = function(req,res,next){
	db.query("INSERT INTO ReportType (CompanyID, Name, Image) VALUES (?,?,?)",
		[req.body.company_id, req.body.name, req.body.image],
		function(err,rows){
			if(err){
				console.log(req, "ERROR", "Cannot add report type");
				return next(err);
			}
			console.log("SUCCESS", "Added report type");
			res.send(rows);
		}
	);
}

exports.editReportType = function(req,res,next){
	db.query("UPDATE ReportType SET Name = ?, Image = ? WHERE ID = ?",
		[req.body.name, req.body.image, req.params.id],
		function(err,rows){
			if(err){
				console.log(req, "ERROR", "Cannot edit report type");
				return next(err);
			}
			console.log("SUCCESS", "Edited report type");
			res.send(rows);
		}
	);
}

exports.deleteReportType = function(req,res,next){
	db.query("DELETE FROM ReportType WHERE ID = ?",
		[req.params.id],
		function(err,rows){
			if(err){
				console.log(req, "ERROR", "Cannot delete report type");
				return next(err);
			}
			console.log("SUCCESS", "Delete report type");
			res.send(rows);
		}
	);
}
