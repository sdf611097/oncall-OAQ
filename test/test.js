'use strict';
const expect = require('chai').expect;
const request = require('request');
const fs = require('fs');
//start app
require('../index.js');

describe('simple tests', function(){
  it('is on', function(done){
    request.get('http://localhost:3000/', function(err, response, body){
      expect(err).to.not.be.ok;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });
  it('insert users to db', function(done){
    request.post('http://localhost:3000/users', function(err, response, body){
      expect(err).to.not.be.ok;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });
  it('update user to db', function(done){
    request.put('http://localhost:3000/users/test', function(err, response, body){
      expect(err).to.not.be.ok;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });
  it('remove user from db', function(done){
    request.delete('http://localhost:3000/users/test', function(err, response, body){
      expect(err).to.not.be.ok;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });
  it('call fun', function(done){
    request.post('http://localhost:3000/functions/notify', function(err, response, body){
      expect(err).to.not.be.ok;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });
});

describe("db ops", function(){
  let db = require('../databaseAdapter.js')("mongodb://localhost:27017/dev");
  let user1 = {email:"test@test.com",name:"name",phone:"0123456789"};
  let user2 = {email:"test2@test.com",name:"name2",phone:"0123456789"};

  it('insert', function(done){
    return db.insert([user1, user2])
    .then(()=>done());
  });

  it('find', function(done){
    db.find(user1.email)
    .then(user=>{
      expect(user.name).to.equal(user1.name);
      return db.find("notexist@test.com");
    })
    .then(user=>{
      expect(user).to.not.be.ok;
      done();
    }).catch(err=>{
      if(err) done(err);
      else done(new Error("something wrong"));
    });
  });

  it('delete', function(done){
    db.delete(user1.email)
    .then(result=>{
      expect(result.deletedCount).to.equal(1);
      return db.delete(user2.email);
    })
    .then(result=>{
      expect(result.deletedCount).to.equal(1);
      return db.delete("notexist@test.com");
    })
    .then(result=>{
      expect(result.deletedCount).to.equal(0);
      done();
    }).catch(err=>{
      if(err) done(err);
      else done(new Error("something wrong"));
    });
  });

});

describe('notify hooks', function(){
  it('email', function(done){
    const fileStr = fs.readFileSync('./test/config.json', 'utf8');
    const config = JSON.parse(fileStr);
    if(!config.sendgrid) {
      done(new Error("no email keys"));
    }
    const emailSender = require('../emailAdapter.js')(config.sendgrid);
    emailSender.send(config.testerEmail)
    .then(result=>{
      expect(result.message).equal.to('success');
      done();
    })
    .catch(err=>{
      done(err);
    });
  });
});
