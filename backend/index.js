const express = require('express');
const db = require('./db.js');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/users/:userID', (req, res) => {
  res.send(req.params);
});


app.route('/users/:userID').get((req, res) => {
  res.send(req.params);
}).post((req, res) => {
  res.send(req.params);
}).put((req, res) => {
  res.send(req.params);
}); 
