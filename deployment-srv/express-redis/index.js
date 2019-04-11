
var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var server =  'http://138.197.3.64:9000'; // 'http://localhost:8080/'

app.use(function (req, res, next) {
  console.log(req.originalUrl);
  if(req.originalUrl=="/iTrust2/patient/index"){
        console.log("NOT ALLOWED");
	res.send("NOT ALLOWED");
  }
  next()
})


app.all("/iTrust2/*", function(req, res) {
    console.log('redirecting to Server1');
    apiProxy.web(req, res, {target: server});
});

app.listen(5000,"0.0.0.0");
