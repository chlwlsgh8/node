
var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var static = require('serve-static');

var app = express();

app.set('port',process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extend : false}));
app.use(bodyParser.json())

app.use(static(path.join(__dirname,'public')));

app.use(function (req, res) {
    console.log('middle ware process');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>id:'+paramId+'password:'+paramPassword+'</h1>');
    res.end();

});

http.createServer(app).listen(3000,function () {
    console.log('server start');
});
