const express = require('express');
const app = express();


app.set("view engine","ejs");
app.use(express.static("public"));



//root route
app.get('/', async function(req, res) {
 
  res.render('home' );
});

//page 1 route
app.get('/page1', async function(req, res) {

  res.render('page1' );
});

//page 2 route
app.get('/page2', async function(req, res) {

  res.render('page2' );
});


app.listen(8000, () => {
  console.log('server started');
});



