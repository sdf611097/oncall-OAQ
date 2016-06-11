'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

let dbUri = process.env.DATABASE_URI || "mongodb://localhost:27017/dev";

const db = require('./databaseAdapter.js')(dbUri);
const emailSender = require('./emailAdapter.js')(process.env.EMAIL_KEY);

app.use(bodyParser.json({type: '*/*'}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


app.get('/users', function (req, res) {
  db.find(req.query)
  .then(data=>{
    if(!data){
      res.status(400).send('user not found');
    }else{
      res.send(data._id);
    }
  })
  .catch(err=>{
    console.log('get users failed', err);
    res.status(400).send('something wrong when get users');
  });
});


//{ usesrs:[]}
app.post('/users', function (req, res) {
  //console.log('users',req.params);
  db.insert(req.body.users)
  .then(()=>{
      res.send('success');
  })
  .catch(err=>{
    console.log('insert users failed', err);
    res.status(400).send('something wrong when insert users');
  });
});

app.put('/users/:id', function (req, res) {
  res.send('not implement yet');
});

app.delete('/users/:id', function (req, res) {
  db.delete({_id: new mongodb.ObjectId(req.params.id)})
  .then(result=>{
      res.send('ok');
  })
  .catch(err=>{
    console.log('delete users failed', err);
    res.status(400).send('something wrong when delete users');
  });

});

app.post('/functions/:fun', function (req, res) {
  //wait for complete or response directly
  console.log('body?', req.body);
  let promise;
  switch(req.params.fun){
    case 'notify':
      promise = notify(req.body);
      break;

    default:
      promise = Promise.reject('unsupported functions');
  }
  promise.then(()=>res.send('done'))
  .catch(err=>{
    console.log(err);
    res.status(400).send("something wrong when do " + req.params.fun);
  });
});

function notify(query) {
  return db.find(query)
  .then(user=> sendEmail(user.email));
}

function sendEmail(email){
  if(process.env.EMAIL_KEY){
    return emailSender.send(email);
  }else{
    return Promise.resolve();
  }
}

exports.db = db;
//ToDo: gracefull shutdown, catch exceptions
