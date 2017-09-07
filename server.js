

var oracledb = require('oracledb');
oracledb.autoCommit = true;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var connectionProperties = {
  user: process.env.DBAAS_USER_NAME || "InsightUser1",
  password: process.env.DBAAS_USER_PASSWORD || "Manager123#",
  connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "129.158.64.10:1521/PDB1.gse00012285.oraclecloud.internal"
};

//console.log("Successful");

var PORT = process.env.PORT || 8089;

//var router = express.Router();



app.get("/ehh", function (request, response, next) {
   console.log("REQUEST:" + request.method + "   " + request.url);
   console.log("BODY:" + JSON.stringify(request.body));
   response.setHeader('Access-Control-Allow-Origin', '*');
   response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   response.setHeader('Access-Control-Allow-Headers',
'X-Requested-With,content-type');
   response.setHeader('Access-Control-Allow-Credentials', true);
   next();
});

/**
  * GET /
  * Returns a list of topics
  */
app.get("/getProviderData", function (request, response) {
   console.log("GET PURCHASES");
   oracledb.getConnection(connectionProperties, function (err, connection) {
     if (err) {
       console.error(err.message);
       response.status(500).send("Error connecting to DB");
       return;
     }
     console.log("After connection");
     connection.execute("SELECT * from SRVC_PRVDR_TAB",{},
       { outFormat: oracledb.OBJECT },
       function (err, result) {
         if (err) {
           console.error(err.message);
           response.status(500).send("Error getting data from DB");
           doRelease(connection);
           return;
         }
         console.log("RESULTSET:" + JSON.stringify(result));
         //var topics = [];
         //result.rows.forEach(function (element) {
           //topics.push({ id: element.ID, title: element.ORIGINATIONMORTGAGEESPONSORORI });
         //}, this);
         response.json(result);
         doRelease(connection);
       });
   });
});

app.get("/getServiceData", function (request, response) {
   console.log("GET PURCHASES");
   oracledb.getConnection(connectionProperties, function (err, connection) {
     if (err) {
       console.error(err.message);
       response.status(500).send("Error connecting to DB");
       return;
     }
     console.log("After connection");
     connection.execute("SELECT * from SRVC_RQST_TAB",{},
       { outFormat: oracledb.OBJECT },
       function (err, result) {
         if (err) {
           console.error(err.message);
           response.status(500).send("Error getting data from DB");
           doRelease(connection);
           return;
         }
         console.log("RESULTSET:" + JSON.stringify(result));
         //var topics = [];
         //result.rows.forEach(function (element) {
           //topics.push({ id: element.ID, title: element.ORIGINATIONMORTGAGEESPONSORORI });
         //}, this);
         response.json(result);
         doRelease(connection);
       });
   });
});
app.post("/addServiceData", function(request, response) {
    var user_id = request.body.USER_ID;
	var serv_id = request.body.SERV_ID;
	var ISSUE_DATE = request.body.ISSUE_DATE;
	var APPT_TIME = request.body.APPT_TIME;
	var SERV_LOCATION = request.body.SERV_LOCATION;
	var PRIORITY = request.body.PRIORITY;
	var IS_COMPLETE = request.body.IS_COMPLETE;
	var CREATED_DATE = request.body.CREATED_DATE;
	var CREATED_BY = request.body.CREATED_BY;
	
	oracledb.getConnection(connectionProperties, function (err, connection) {
     if (err) {
       console.error(err.message);
       response.status(500).send("Error connecting to DB");
       return;
     }
     console.log("After connection");
     connection.execute("Insert into SRVC_RQST_TAB (ISSUE_DATE,APPT_TIME,SERV_LOCATION,PRIORITY,IS_COMPLETE,SERV_ID,USER_ID,CREATED_DATE,CREATED_BY) values('"+ISSUE_DATE+"','"+APPT_TIME+"','"+SERV_LOCATION+"','"+PRIORITY+"','"+IS_COMPLETE+"','"+serv_id+"','"+user_id+"','"+CREATED_DATE+"','"+CREATED_BY+"')" ,
       { outFormat: oracledb.OBJECT },
       function (err, result) {
         if (err) {
           console.error(err.message);
           response.status(500).send("Error getting data from DB");
           doRelease(connection);
           return;
         }
         console.log("RESULTSET:" + JSON.stringify(result));
         //var topics = [];
         //result.rows.forEach(function (element) {
           //topics.push({ id: element.ID, title: element.ORIGINATIONMORTGAGEESPONSORORI });
         //}, this);
         response.json(result);
         doRelease(connection);
       });
   });
    
});


function doRelease(connection) {
  connection.release(function (err) {
    if (err) {
      console.error(err.message);
    }
  });
}


app.listen(PORT, function(err) {
	if(err) {
		console.log("errr", err);
	}

	console.log("on port" + PORT);
})