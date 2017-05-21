var db = require(__dirname + './../database/mysql')

'use strict';

exports.login = function(req, res, next){
	var username = req.body.username;
    var password = req.body.password;

    // if (req.session.username) {
    //     console.log(req, "FAILED", 'Someone is already logged in.');
    //     return res.status(400).send("Someone is already logged in.");
    // }

    if (!username) {
        console.log(req, "FAILED", 'Username cannot be blank.');
        return res.status(400).send("Username cannot be blank.");
    }
    if (!password) {
        console.log(req, "FAILED", 'Password cannot be blank.');
        return res.status(400).send("Password cannot be blank.");
    }

    db.query("SELECT username FROM User WHERE username= ? " +
            "UNION SELECT username from Admin WHERE username= ? ", 
        [username, username], function (err, rows) {
        if(err) {
            return next(err);
        }
        if(rows.length) {
            db.query("SELECT * FROM Admin WHERE username = ? AND password = ?",
                [username, password], function (err2, rows2) {
                if(err2) {
                    return next(err2);
                }
		        if (rows2.length) {
		            req.session.username = rows2[0].Username;
		            req.session.role = 'ADMIN';
		            delete rows2[0].Password;
		            rows2[0].role = 'ADMIN';
		            console.log("SUCCESS", 'Successfully logged in.');
		            return res.send(rows2);
		        } else {
		            db.query("SELECT * FROM User WHERE username = ? AND password = ?",
		                [username, password], function (err3, rows3) {
		                
		                if(err3) {
		                    return next(err3);
		                }
		                
		                if (rows3.length) {
		                    req.session.username = rows3[0].Username;
		                    req.session.company = rows3[0].CompanyID;
		                    req.session.role = 'USER';

		                    delete rows3[0].Password;
		                    rows3[0].role = 'USER';
		                    console.log(req, "SUCCESS", 'Successfully logged in.');
		                    return res.send(rows3);
		                } else {
		                console.log(req, "FAILED", 'Incorrect Password!');
		                    return res.status(400).send("Incorrect Password!");
		                }
		            });
		        }
            });
		}else {
	            console.log(req, "FAILED", 'Username not Found!');
	            return res.status(400).send("Username not Found!");
	        }
	    });
};

exports.loginAndroid = function(req, res, next){
	var username = req.body.username;
    var password = req.body.password;

    // if (req.session.username) {
    //     console.log(req, "FAILED", 'Someone is already logged in.');
    //     return res.status(400).send("Someone is already logged in.");
    // }

    if (!username) {
        console.log(req, "FAILED", 'Username cannot be blank.');
        return res.status(400).send("Username cannot be blank.");
    }
    if (!password) {
        console.log(req, "FAILED", 'Password cannot be blank.');
        return res.status(400).send("Password cannot be blank.");
    }

    db.query("SELECT username FROM User WHERE username= ? " , 
        [username], function (err, rows) {
        if(err) {
            return next(err);
        }
        if(rows.length) {
            db.query("SELECT * FROM User WHERE username = ? AND password = ?",
                [username, password], function (err2, rows2) {
                if(err2) {
                    return next(err2);
                }
		        if (rows2.length) {
		            console.log("SUCCESS", 'Successfully logged in.');
		            return res.send(rows2[0]);
		        } 
            });
		}else {
	            console.log(req, "FAILED", 'Username not Found!');
	            return res.status(400).send("Username not Found!");
	        }
	    });
};

exports.logout = function (req, res, next) {
    if (!req.session.username) {
        console.log(req, "FAILED", "No one is logged in.");
        return res.status(400).send("No one is logged in.");
    }

    console.log(req, "SUCCESS", 'Successfully logged out.');
    req.session.destroy();

    return res.send("Successfully logged out!");
}

exports.getOne = function(req, res, next){
	db.query("SELECT * FROM User WHERE ID = ?",
        [req.params.user_id],
        function (err, rows) {
            if (err) {
                console.log(req, "ERROR", "MySQL Query Error");
                return next(err);
            }
            if (rows.length === 0) {
                console.log(req, "ERROR", "Error: User not found!");
                res.send(404, "Error: User not found!");
            } else {
                console.log(req, "SUCCESS", "RETRIEVED details of "+req.params.user_id);
                res.send(rows);
            }
        }
    );
};

exports.getAllByCompany = function(req, res, next){
	db.query("SELECT DISTINCT * FROM User WHERE CompanyID = ? ORDER BY LastName",
        [req.session.CompanyID],
        function (err, rows) {
            if (err) {
               	console.log(req, "ERROR", "MySQL Query Error");
                return next(err);
            }
            console.log(req, "SUCCESS", "RETRIEVED all user on a company.");
            res.send(rows);
        }
    );
}

exports.checkSession = function (req, res, next) {
    if (!req.session.username) {
        return res.send("NO_SESSION");
    }else{
        return res.send("SESSION");
    }
}

exports.validate = function(req, res, next){
	db.query("UPDATE User SET IsVerified = 1 WHERE ID = ?",
		 [req.body.user_id], function (err, rows) {
		    if(err) {
		        return next(err);
		    }
		    res.send(rows);
	});
}

exports.getLocation = function(req, res, next){
	db.query("SELECT * FROM Location WHERE UserID = ? AND Time LIKE CONCAT(?,'%') AND isReport = false ORDER BY Time",
		 [req.params.user_id, req.params.date], function (err, rows) {
		    if(err) {
		        return next(err);
		    }
		    res.send(rows);
	});
}

exports.getReport = function(req, res, next){
	db.query("SELECT * FROM Report WHERE UserID = ? ORDER BY DateSubmitted",
		 [req.params.user_id], function (err, rows) {
		    if(err) {
		        return next(err);
		    }
		    res.send(rows);
	});
}

exports.getOneByUsername = function(req, res, next){
	db.query("SELECT * FROM User WHERE Username = ?",
		 [req.params.username], function (err, rows) {
		    if(err) {
		        return next(err);
		    }
		    res.send(rows[0]);
	});
}

exports.add = function(req,res,next){
	db.query("SELECT * FROM User WHERE Username = ?",
		[req.body.username],
		function(err,rows){
			if(rows[0]){
				console.log(req, "ERROR", "Username already exists");
				return res.send(400,"Username already exists");
			}
			else{
				console.log("Adding user");
				db.query("INSERT INTO User (LastName, FirstName, Username, Password, Email, CompanyID) VALUES (?,?,?,?,?,?)",
					[req.body.lastname, req.body.firstname, req.body.username, req.body.password, req.body.email, req.body.companyid],
					function(err1,rows1){
						if(err1){
							console.log(req, "ERROR", "Cannot add user");
							return next(err1);
						}
						console.log("SUCCESS", "Added a user");
						res.send(rows1[0]);
					}
				);
			}
		}
	);
}


exports.remove = function(req,res,next){
	db.query("DELETE FROM User WHERE ID = ?",
		[req.body.user_id],
		function(err,row){
			if(err){
				console.log(req, "ERROR", "Cannot remove user");
				return next(err);
			}
			if(row.affectedRows == 1){
				console.log("SUCCESS", "Deleted a user");
				res.send(row);
			}
			else{
				console.log(req, "ERROR", "Cannot remove user");
				res.end();
			}
		});
}



