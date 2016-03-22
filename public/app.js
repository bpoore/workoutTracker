//Test using git push/pull for server work...

var serverURL = 'http://52.35.35.75:3000';

function getData() {
  var req = new XMLHttpRequest();
  req.open("GET", serverURL + '/get-data', true);
  req.addEventListener('load', function() {
      if(req.status >= 200 && req.status < 400) {
        data = JSON.parse(req.responseText);
        buildTable(data);
      } 
      else {
        console.log("Error in network request: " + request.statusText);
      }
    });
    req.send();
} 

function bindSubmitButtons(){
  var homeSubmit = document.getElementById('submit-exercise');
  if (homeSubmit) {
    document.getElementById('submit-exercise').addEventListener('click', function(event) {
      event.preventDefault();
      var req = new XMLHttpRequest();
      console.log("its been clicked");
      var queryString = '?name=' + document.getElementById('exerciseName').value + '&reps=' + document.getElementById('reps').value + '&weight=' + document.getElementById('weight').value + '&date=' + document.getElementById('exercise-date').value + '&lbs=' + document.getElementById('lbs-value').value;
      console.log(queryString);
      if (document.getElementById('exerciseName').value == "") {
        alert('Error, no name');
      } else {
      req.open("GET", serverURL + '/insert' +  queryString, true);
      req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
          window.location.href = "../";
          data = JSON.parse(req.responseText);
          clearBody();
          buildTable(data);
        } 
        else {
          console.log("Error in network request: " + request.statusText);
        } 
      });
      req.send();
    } 
  });
} 

  var updateSubmit = document.getElementById('submit-update');
  if (updateSubmit) {
    document.getElementById('submit-update').addEventListener('click', function(event) {
      event.preventDefault();
      var req = new XMLHttpRequest();
      var queryString = '?name=' + document.getElementById('exerciseName').value + '&reps=' + document.getElementById('reps').value + '&weight=' + document.getElementById('weight').value + '&date=' + document.getElementById('exercise-date').value + '&lbs=' + document.getElementById('lbs-value').value + '&id=' + document.getElementById('exId').value;
      console.log(queryString);
      if (document.getElementById('exerciseName').value == "") {
        alert('Error, no name');
      } else {
      req.open("GET", serverURL + '/update' +  queryString, true);
      req.addEventListener('load', function() {
          if(req.status >= 200 && req.status < 400) {
            window.location.href = "../";
          } 
          else {
            console.log("Error in network request: " + request.statusText);
          }
        });
        req.send();
      }
    });
  }  
} 

function bindDeleteBtn(btn, id) {
  btn.addEventListener('click', function(event) { 
    event.preventDefault();
    var req = new XMLHttpRequest();
    req.open("GET", serverURL + '/delete?id=' +  id, true);
    req.addEventListener('load', function() {
      if(req.status >= 200 && req.status < 400) {
        var data = JSON.parse(req.responseText);
        clearBody();
        buildTable(data);
      } 
      else {
        console.log("Error in network request: " + request.statusText);
      }
    });
      req.send();
  }) 
} 

function bindUpdateBtn(btn, id) {
  btn.addEventListener('click', function(event) { 
    window.location.href = "../edit?id=" + id;
  }) 
} 

function clearBody() {
  var parent = document.getElementById('exerciseData');
  while(parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function buildTable(data) {
  var parent = document.getElementById('exerciseData');

  for(var i=0; i<data.length; i++) {
    var exerciseRow = document.createElement('tr');
    
    var name = document.createElement('td');
    name.textContent = data[i].name;
    exerciseRow.appendChild(name);
    
    var reps = document.createElement('td');
    reps.textContent = data[i].reps;
    exerciseRow.appendChild(reps);
    
    var weight = document.createElement('td');
    weight.textContent = data[i].weight;
    exerciseRow.appendChild(weight);

    var date = document.createElement('td');
    date.textContent = data[i].date;
    exerciseRow.appendChild(date);
    
    var units = document.createElement('td');
    if (data[i].lbs)
    {
      units.textContent = 'lbs';
    } else {
      units.textContent = 'kgs';
    } 
    exerciseRow.appendChild(units);

    var delCell = document.createElement('td');
    var delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.type = 'submit';
    delBtn.className = 'btn btn-danger';
    bindDeleteBtn(delBtn, data[i].id);
    delCell.appendChild(delBtn);
    exerciseRow.appendChild(delCell);

    var updateCell = document.createElement('td');
    var updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update';
    updateBtn.type = 'submit';
    updateBtn.className = 'btn btn-primary';
    bindUpdateBtn(updateBtn, data[i].id);
    updateCell.appendChild(updateBtn);
    exerciseRow.appendChild(updateCell);

    parent.appendChild(exerciseRow);
  } 
}

document.addEventListener("DOMContentLoaded", bindSubmitButtons); 

if (window.location.href == serverURL + '/') {
  window.onload = getData;
}

