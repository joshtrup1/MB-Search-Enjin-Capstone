const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
var completedList = fs.readFileSync('./completed_videos.json');
var completed = JSON.parse(completedList);

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

// script for parsing video
var video_script = require('./videoScript')
var cron = require('node-cron');
video_script.start();
cron.schedule('0 0 2 * * *', () =>{
    // video_script.start()
    console.log('running at 2am')
})



//root route
app.get('/:className', async function(req, res) {
  const className = req.params.className;
  const info = classType(className);
  res.render('home', {className: className, info: info, search_term: undefined});
});

app.post('/:className', async function(req, res) {
  const className = req.params.className;
  var search_term = req.body.search;
  const info = classType(className);
  res.render('home', {search_term: search_term, className: className, info: info});
});

//admin route
app.get('/admin', async function(req, res) {

  res.render('admin' );
});


function classType(className) {

  var classInfo = {
    cst329: ['CST 329','Reasoning with Logic','1ZtGODBQ9XVYusZNiwMc9v1j9veKglTMY','background.jpg'],
    cst334: ['CST 334','Operating Systems','1ZtGODBQ9XVYusZNiwMc9v1j9veKglTMY','gray.jpg'],
    cst383: ['CST 383','Introduction to Data Science','1ZtGODBQ9XVYusZNiwMc9v1j9veKglTMY','background.jpg']
  }

  for (let k in classInfo) {
    if (className == k) {
      return classInfo[k];
    }
  }

};


const PORT = process.env.PORT || 8000;   
app.listen(PORT, () => {    
  console.log(`Server is running on port ${PORT}.`);   
});


