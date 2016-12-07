var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var db = require('./dbqueries.js');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'password',
  database        : 'weightlifting'
});


app.get('/',function(req,res,next){
    res.render('home');
});

app.get('/get-data',function(req,res,next){
  db.getExercises().then(function(exercises) {
    console.log(exercises);
    res.json(exercises);
  }); 
});

app.get('/insert',function(req,res,next){
  pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
  });
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.json(rows);
  });
});

app.get('/delete',function(req,res,next){
  pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
  });
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.json(rows);
  });
});


///safe-update?id=1&name=The+Task&done=false
app.get('/update',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
        function(err, result){
          if(err){
            next(err);
            return;
          }
        });
      }
       res.render('home', context)
  });
}); 

app.get('/edit',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    } 
    context.id = req.query.id;
    context.results = rows[0]
    res.render('edit', context);
    }); 
}); 

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
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

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
}); 
