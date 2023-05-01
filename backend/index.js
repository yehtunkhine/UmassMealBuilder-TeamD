const express = require('express');
const cors = require('cors');
const { json } = require('sequelize');
const db = require('./db.js');
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// app.get('/users/:userID', (req, res) => {
//   res.send(req.params);
// });


app.route('/users/:userID').get((req, res) => {
  let userObject = JSON.parse(req.params.userID);
  let uid = userObject.uid;
  res.send(uid);
}).post((req, res) => {
  res.send(req.params);
}).put((req, res) => {
  res.send(req.params);
});  
