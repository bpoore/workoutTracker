var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'password',
  database        : 'weightlifting'
});


exports.getExercises = function() { 
  return new Promise(function(resolve, reject) {
    pool.query('SELECT name, reps, weight, DATE_FORMAT(date, "%d-%m-%Y") as date, lbs FROM workouts', function(err, results, fields) {
      if (err) {
        console.log("Error retrieving exercise data");;
        return;
      }
      resolve(results);
    });
  });
};