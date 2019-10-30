require('dotenv').config();
//date_default_timezone_set('America/Sao_Paulo');

var express  = require('express');
var app = express();
var Firebase = require('firebase');
var bodyParser = require('body-parser');
var getIP = require('ipware')().get_ip;
var dateFormat = require('dateformat');


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

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.get('/', function (req, res) {
  res.send("Server is up!");
})

// create user
app.post('/api/createLead', function(req, res) {
      var data = req.body;
      var email = req.body.email;
      email = email.split('@');
      if (email[1] == "gmail.com" || email[1] == "hotmail.com"
        || email[1] == "@outlook.com" || email[1] == "@live.com"
        || email[1] == "@yahoo.com" || email[1] == "@yahoo.com.br"
        || email[1] == "@bol.com.br"
        || email[1] == "@uol.com"){
        data.tipo = "B2C";
      }else
        data.tipo = "B2B";

      
      var date = dateFormat(new Date().toLocaleString('pt-br', {timezone: 'America/Sao_Paulo'}), "yyyy-mm-dd HH:MM:ss");
      //data.cadastro = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      data.cadastro = date;
      data.ip = getIP(req).clientIp;

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

app.listen(process.env.PORT || 3000)