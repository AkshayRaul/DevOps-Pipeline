var redis = require('redis')
var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var server =   'http://localhost:8080/'
var client = redis.createClient(6379, '127.0.0.1', {})

url_mappings={
  "iTrust_logentries":"/iTrust2/api/v1/logentries/range",
  "role":"/iTrust2/api/v1/role",
  "patients":"iTrust2/api/v1/patients"
  /**
   * Add mappings from features to urls
   */
}

app.use(function (req, res, next) {
  console.log(req.originalUrl);
  var url=""
  var status_url=""
  client.get("urlKey", function(err,value){
    console.log(value)
    url=value;
   client.get("status", function(err,value){
     console.log(value)
     status_url=value
     if(req.originalUrl==url && status_url=="true"){

        console.log("Feature to roll out soon");
        res.send("Feature to roll out soon");
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

