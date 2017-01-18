var mysql = require('mysql');
var SQL = require('sql-template-strings');

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'us-cdbr-iron-east-04.cleardb.net',
  user            : 'bbef480f7baaba',
  password        :  process.env.DATABASE_PASSWORD,
  database        : 'heroku_643b9f3b4adb7e5'
});


exports.getExercisesDateFormatted = function() {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT id, name, reps, weight, DATE_FORMAT(date, "%M %d, %Y") as date, lbs  FROM workouts', function(err, results, fields) {
      if (err) {
        console.log("Error retrieving exercise data");;
        return;
      }
      resolve(results);
    });
  });
};

exports.getExercise = function(id) {
  return new Promise(function(resolve, reject) {
    pool.query(SQL`SELECT * FROM workouts WHERE id=${id}`, function(err, results, fields) {
      if (err) {
        console.log("Error retrieving exercise data");;
        return;
      }
      resolve(results[0]);
    });
  });
};

exports.updateExercise = function(name, reps, weight, date, lbs, id) {
  return new Promise(function(resolve, reject) {
    pool.query(SQL`UPDATE workouts SET name=${name}, reps=${reps}, weight=${weight}, date=${date}, lbs=${lbs} WHERE id=${id}`, function(err, results, fields) {
      if (err) {
        console.log(err);
        console.log("Error updating exercise data");;
        return;
      }
      resolve();
    });
  });
};

exports.insertExercise = function(name, reps, weight, date, lbs) {
  if (reps.length === 0) {
    reps = undefined;
  };

  if (weight.length === 0) {
    weight = undefined;
  };

  if (date.length === 0) {
    date = undefined;
  };

  return new Promise(function(resolve, reject) {
    pool.query(SQL`INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (${name}, ${reps}, ${weight}, ${date}, ${lbs})`, function(err, results, fields) {
      if (err) {
        console.log(err);
        console.log("Error inserting exercise");;
        return;
      }
      resolve();
    });
  });
};

exports.deleteExercise = function(id) {
  return new Promise(function(resolve, reject) {
    pool.query(SQL`DELETE FROM workouts WHERE id=${id}`, function(err, results, fields) {
      if (err) {
        console.log("Error deleting exercise data");;
        return;
      }
      resolve(results);
    });
  });
};
