const express = require('express');
const app = express();


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
// video_script.start()
cron.schedule('0 0 2 * * *', () =>{
    // video_script.start()
    console.log('running at 2am')
})



//root route
app.get('/:className', async function(req, res) {
  const className = req.params.className;
  const info = classType(className);
  res.render('home', {className: className, info: info});
});

app.post('/:className', async function(req, res) {
  const className = req.params.className;
  var search_term = req.body.search;

  res.render('search_results', {classInfo: Info});
});

//page 1 route
app.get('/page1', async function(req, res) {

  res.render('page1' );
});

//page 2 route
app.get('/search_results', async function(req, res) {

  res.render('search_results' );
});

app.post('/search_results', async function(req, res) {
  var search_term = req.body.search;

  res.render('search_results', {search_term: search_term});
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


app.listen(8000, () => {
  console.log('server started');
});

/*
app.listen(process.env.PORT, process.env.IP , function()
{
   var loopNum = 4; 
    
    for(let i = 0 ; i < loopNum ; i++)
    {
       console.log("Opening with KEY::ID" + (i*34) + " ACCESS");
       console.log("Opening with KEY::ID" + (i*346)+ 0 + " accessACCESS");
    }
    console.log("Welcome , currently retreiving IP ::::");
    console.log("Express Server is now Running...");
});
**/
