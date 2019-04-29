var redis = require('redis')
var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var server =   'http://localhost:8080/'
var client = redis.createClient(6379, '127.0.0.1', {})

app.use(function (req, res, next) {
  console.log(req.originalUrl);
  var url="/iTrust2/patient/index"
  var status_url=""
  client.get("urlKey", function(err,value){
    console.log(value)
    url=value;
   client.get("status", function(err,value){
     console.log(value)
     status_url=value
     if(req.originalUrl==url && status_url=="true"){

        console.log("NOT ALLOWED");
        res.send("NOT ALLOWED");
     }else{
        next()
     }

    });

  });

})


app.all("/iTrust2/*", function(req, res) {
    console.log('redirecting to Server1');
    apiProxy.web(req, res, {target: server});
});

app.listen(3003,"0.0.0.0");

