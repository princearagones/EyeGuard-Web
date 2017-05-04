var mysql      = require('mysql');
// app.use(require('body-parser')());
// app.use(require('method-override')());
// app.use(require(__dirname+'/config/router')(express.Router()));
var db      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'user',
    database : 'EyeGuard',
    debug    :  false
});

db.getConnection(function(err,connection){
        if (err) {
          console.log("Error: Connection to MySql was not established!");
          return;
        }else{
        	console.log("Success: Connection to MySql is established!");
        }
  });

module.exports = db;