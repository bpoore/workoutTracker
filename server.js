var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var envFile = require('node-env-file');
console.log(envFile(path.join(__dirname, 'config/dbcredentials.env')));
envFile(path.join(__dirname, 'config/dbcredentials.env'));

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var db = require('./dbqueries.js');

app.use(express.static('public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var port = process.env.PORT || 3000;

app.get('/',function(req,res,next){
    res.render('home');
});

app.get('/get-data',function(req,res,next){
  db.getExercisesDateFormatted().then(function(exercises) {
    res.json(exercises);
  });
});

app.get('/insert', function(req,res,next) {
  db.insertExercise(req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs).then(function () {
    db.getExercisesDateFormatted().then(function (exercises) {
      res.json(exercises);
    })
  });
});

app.get('/delete', function(req,res,next) {
  db.deleteExercise(req.query.id).then(function () {
    db.getExercisesDateFormatted().then(function (exercises) {
      res.json(exercises);
    })
  });
});

///safe-update?id=1&name=The+Task&done=false
app.get('/update',function(req,res,next){
  db.updateExercise(req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.id).then(function () {
    db.getExercisesDateFormatted().then(function (exercises) {
      res.json(exercises);
    });
  });
});


app.get('/edit',function(req,res,next){
  db.getExercise(req.query.id).then(function(exercise) {
    res.render('edit', exercise);
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(port, function(){
  console.log('Express started on http://localhost:' + port + '; press Ctrl-C to terminate.');
});
