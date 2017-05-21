var db = require(__dirname + './../database/mysql')

'use strict';


exports.getUnverifiedUsers = function(req, res, next){
	if (!req.session.username) {
        console.log(req, "FAILED", "No one is logged in.");
        return res.status(400).send("No one is logged in.");
    }
    db.query("SELECT * FROM User WHERE CompanyID = ? AND IsVerified = 0",
    	[req.params.id]
    	,function(err,rows){
    	if(err){
    		console.log(req, "ERROR", "Error: MySQL Query of users failed");
    		return next(err);
    	}
    	console.log(req, "SUCCESS", "RETRIEVED unverfied users users from "+req.params.class_id);
        res.send(rows);
    });
}

exports.getUsers = function(req, res, next){
	if (!req.session.username) {
        console.log(req, "FAILED", "No one is logged in.");
        return res.status(400).send("No one is logged in.");
    }
    db.query("SELECT * FROM User WHERE CompanyID = ? AND IsVerified = 1",
    	[req.params.id]
    	,function(err,rows){
    	if(err){
    		console.log(req, "ERROR", "Error: MySQL Query of users failed");
    		return next(err);
    	}
    	console.log(req, "SUCCESS", "RETRIEVED  verified users from "+req.params.class_id);
        res.send(rows);
    });
}

exports.add = function(req,res,next){
	db.query("SELECT * FROM Admin WHERE Username = ?",
		[req.body.username],
		function(err,rows){
			if(rows[0]){
				console.log(req, "ERROR", "Username already exists");
				return res.send(400,"Username already exists");
			}
			else{
				console.log("Adding admin");
				db.query("INSERT INTO Admin (LastName, FirstName, Username, Password, Email, CompanyID, IsSuperAdmin) VALUES (?,?,?,?,?,?,?)",
					[req.body.lastname, req.body.firstname, req.body.username, req.body.password, req.body.email, req.body.companyid, req.body.issuperadmin],
					function(err1,rows1){
						if(err){
							console.log(req, "ERROR", "Cannot add admin");
							return next(err1);
						}
						console.log("SUCCESS", "Added an admin");
						res.send(rows1);
					}
				);
			}
		}
	);
}

exports.getCompanyID = function(req, res, next){
	db.query("SELECT CompanyID FROM Admin WHERE Username = ?",
        [req.params.username],
        function (err, rows) {
            if (err) {
                console.log(req, "ERROR", "MySQL Query Error");
                return next(err);
            }
            if (rows.length === 0) {
                console.log(req, "ERROR", "Error: Admin not found!");
                res.send(rows);
            } else {
                console.log(req, "SUCCESS", "RETRIEVED details of "+req.params.username);
                res.send(rows);
            }
        }
    );
};