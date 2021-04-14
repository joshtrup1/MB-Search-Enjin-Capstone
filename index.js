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




//root route
app.get('/', async function(req, res) {
 
  res.render('home' );
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

const parseRouter = require('./routes/parse');

app.use('/parse', parseRouter);


app.listen(8000, () => {
  console.log('server started');
});

