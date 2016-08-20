var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo=require('mongoskin');
var mongodb=require('mongodb');
var url=require('url');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


var db=mongo.db("mongodb://localhost:27017/datamonster",{native_parser:true});
var searchurl,version;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

routes.get('/findFileNames',function(req,res){
  console.log("Yes Coming");
  var fileResults={"results":{}}
  var url_parts=url.parse(req.url,true);
  var query=url_parts.query;
  var searchurl=query.searchurl;
  var searchurl=req.query['searchurl'];
   // searchurl=req.params.searchurl.valueOf();
   // searchurl=decodeURIComponent(searchurl.replace(/\+/g,  " "))
   console.log(searchurl);
   db.collection('domains').find({'url':searchurl}).toArray(function(err,docs){
    if(!err){
      fileResults.results=docs;
      res.send(fileResults);
    }else{
      res.send("Failure");
    }
   })
});

routes.get('/addIndex',function(req,res){
  var url_parts=url.parse(req.url,true);
  var query=url_parts.query;
  var searchurl=req.query['searchurl'];
  var fileName=req.query['filename'];
  var timestamp=req.query['timestamp'];
  var dataBuilt={"url":searchurl,"filename":fileName,"timestamp":timestamp};
  
      db.collection('domains').insert(dataBuilt,function(err,docs){
        if(err){
          res.send("Error while Adding Index ");
        }else{
          res.send("Success");
          
        }
      });
     
    
  });
