'use strict';
const express = require('express');
const app = express();
const db = require('./databaseAdapter.js');


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.post('/users', function (req, res) {
  console.log('body',req.body);
  //db.insert(req.body);
  res.send('not implement yet');
});

app.put('/users/:id', function (req, res) {
  console.log('uid',req.params.id);
  res.send('not implement yet');
});

app.delete('/users/:id', function (req, res) {
  res.send('not implement yet');
});

app.post('/functions/:fun', function (req, res) {
  console.log('fun',req.params.fun);
  //wait for complete or response directly
  res.send('not implement yet');
});


//ToDo: gracefull shutdown, catch exceptions
