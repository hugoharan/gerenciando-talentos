var express  = require('express');
var app = express();
var Firebase = require('firebase');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var multer = require('multer');
var fs = require("fs");
var getIP = require('ipware')().get_ip;


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

Firebase.initializeApp({
    databaseURL: "https://gerenciando-talentos.firebaseio.com/",
    serviceAccount: './app.json', //this is file that I downloaded from Firebase Console
});

var db = Firebase.database();
var leadsRef = db.ref("leads");

// app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
// app.use('/public/uploads',express.static(__dirname + '/public/uploads'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.get('/', function (req, res) {
  res.json({message: "Server is up!", result: true});
})

// create user
app.post('/api/createLead', function(req, res) {
   // var userEmail = req.body.user_email;
      var data = req.body;
      var date = new Date();

      data.cadastro = date.toLocaleString('pt-br', {timezone: 'Brazil/brt'});
      data.ip = getIP(req);
    leadsRef.push(data, function(err) {
      if (err) {
        res.send(err)
      } else {
        // var key = Object.keys(snapshot.val())[0];
        // console.log(key);
        res.json({message: "Success: Lead Save.", result: true});
      }
    });
});

// get users
app.post('/api/getLeads', function(req, res) {
    var uid = "vix8Uq7pFNRFQ6gyLxs1";
  if (uid.length != 20) {
    res.json({message: "Error: uid must be 20 characters long."});
  } else {
    leadsRef.once("value", function(snapshot) {
      //console.log(snapshot);
      if (snapshot.val() == null) {
        res.json({message: "Error: No Lead found", "result": false});
      } else {
        res.json({"message":"successfully fetch data", "result": true, "data": snapshot.val()});
      }
    });
  }
});

app.listen(3000);