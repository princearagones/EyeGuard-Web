var db = require(__dirname + './../database/mysql')

'use strict';

exports.add = function(req, res, next){
	db.query("SELECT * FROM Company WHERE Code = ?",
		[req.body.code],
		function(err,rows){
			if(rows[0]){
				console.log(req, "ERROR", "Company code already exists");
				return res.send(400,"Company code already exist");
			}
			else{
				console.log("adding company");
				db.query("INSERT INTO Company (Name, Code) VALUES (? , ?)",
					[req.body.name, req.body.code],
					function(err1,rows1){
						if(err){
							console.log(req, "ERROR", "Cannot add company");
							return next(err1);
						}
						console.log(req, "SUCCESS", "Added a company");
						res.send(rows1);
					}
				);
			}
		}
	);
}

exports.getOneByCode = function(req, res, next){
	db.query("SELECT * FROM Company WHERE Code = ?",
		[req.params.code],
		function(err,rows){
			if(err){
				console.log(req, "ERROR", "MySQL Query of companyID Error");
                return next(err);
			}
			console.log(req, "SUCCESS", "Retrieved Company");
            res.send(rows);
		}
	);
}

exports.getOneByID = function(req, res, next){
	db.query("SELECT * FROM Company WHERE ID = ?",
		[req.params.id],
		function(err,rows){
			if(err){
				console.log(req, "ERROR", "MySQL Query of company Error");
                return next(err);
			}
			console.log(req, "SUCCESS", "Retrieved Company");
            res.send(rows);
		}
	);
}

exports.getCompanyByUsername = function(req, res, next){
	if (!req.session.username) {
        console.log(req, "FAILED", "No one is logged in.");
        return res.status(400).send("No one is logged in.");
    }
    else{
    	db.query("SELECT CompanyID FROM User WHERE username = ?"+
            "UNION SELECT CompanyID FROM Admin WHERE username = ?",
            [req.session.username,req.session.username],
            function(err, rows){
            	if (err) {
               	console.log(req, "ERROR", "MySQL Query of companyID Error");
                return next(err);
	            }
	            console.log(req, "SUCCESS", "RETRIEVED all companyID on a user.");
	            res.send(rows[0]);
            });
    }
}

exports.getOneByUsername = function(req, res, next){
	db.query("SELECT * FROM Company WHERE Name = ?",
        [req.params.company_name],
        function (err, rows) {
            if (err) {
                console.log(req, "ERROR", "MySQL Query Error");
                return next(err);
            }
            if (rows.length === 0) {
                // console.log(req, "ERROR", "Error: Company not found!");
                res.send(rows);
            } else {
                console.log(req, "SUCCESS", "RETRIEVED details of "+req.params.company_name);
                res.send(rows);
            }
        }
    );
}

exports.getAllCode = function(req, res, next){
	db.query("SELECT Code FROM Company",
        function (err, rows) {
            if (err) {
                console.log(req, "ERROR", "MySQL Query Error");
                return next(err);
            }
            console.log(req, "SUCCESS", "RETRIEVED all Company Code ");
            res.send(rows);
        }
    );
}