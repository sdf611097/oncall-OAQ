'use strict';
const expect = require('chai').expect;
const request = require('request');
const fs = require('fs');
const fileStr = fs.readFileSync('./test/config.json', 'utf8');
const config = JSON.parse(fileStr);
//start app
const oncall = require('../index.js');

describe('simple tests', function(){
  let user1 = {email:"test@test.com",name:"name",phone:"0123456789"};
  let user2 = {email:"test2@test.com",name:"name2",phone:"0123456789"};

  it('is on', function(done){
    request.get('http://localhost:3000/', function(err, response, body){
      expect(err).to.not.be.ok;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });
  it('insert users to db', function(done){
    let options={
      uri: 'http://localhost:3000/users',
      method: 'POST',
      json: {
        users : [user1, user2]
      }
    };
    request(options, function(err, response, body){
      expect(err).to.not.be.ok;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });

  it('get user id from db', function(done){
      function getId(email){
        let options = {
          url: 'http://localhost:3000/users',
          qs: {
            email: email
          }
        };
        return new Promise((resolve, reject)=>{
          request.get(options, function(err, response, body){
            expect(err).to.not.be.ok;
            expect(response.statusCode).to.equal(200);
            resolve(body);
          });
        });
      }
      Promise.all([getId(user1.email), getId(user2.email)])
      .then(ids=>{
        expect(ids.length).to.equal(2);
        if(ids[0].length==26){
          ids[0] = ids[0].split('"')[1];
        }
        if(ids[1].length==26){
          ids[1] = ids[1].split('"')[1];
        }
        user1.id = ids[0];
        user2.id = ids[1];
        done();
      }).catch(err=> done(err));
  });

  it('update user to db', function(done){
    request.put('http://localhost:3000/users/test', function(err, response, body){
      expect(err).to.not.be.ok;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });
  it('remove user from db', function(done){
    function remove(id){
        return new Promise((resolve, reject)=>{
          request.delete('http://localhost:3000/users/'+id, function(err, response, body){
            expect(err).to.not.be.ok;
            expect(response.statusCode).to.equal(200);
            resolve();
          });
        });
    }
    Promise.all([remove(user1.id), remove(user2.id)])
    .then(()=> done())
    .catch(err=> done(err));

  });
  it('call fun', function(done){
    function insert(){
      return new Promise((resolve, reject)=>{
        let options={
          uri: 'http://localhost:3000/users',
          method: 'POST',
          json: {
            users : [{email:config.testerEmail}]
          }
        };
        request(options, function(err, response, body){
          expect(err).to.not.be.ok;
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    }

    let options = {
      method: "POST",
      url: 'http://localhost:3000/functions/notify',
      json: {email:config.testerEmail}
    };
    insert()
    .then(()=>{
      request(options, function(err, response, body){
        console.log(err);
        expect(err).to.not.be.ok;
        console.log(body);
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
});

describe("db ops", function(){
  //let db = require('../databaseAdapter.js')("mongodb://localhost:27017/dev");
  let db = oncall.db;
  let user1 = {email:"test@test.com",name:"name",phone:"0123456789"};
  let user2 = {email:"test2@test.com",name:"name2",phone:"0123456789"};

  it('insert', function(done){
    return db.insert([user1, user2])
    .then(()=>done());
  });

  it('find', function(done){
    db.find({email:user1.email})
    .then(user=>{
      expect(user.name).to.equal(user1.name);
      return db.find({email:"notexist@test.com"});
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
    db.delete({email:user1.email})
    .then(result=>{
      expect(result.deletedCount).to.equal(1);
      return db.delete({email:user2.email});
    })
    .then(result=>{
      expect(result.deletedCount).to.equal(1);
      return db.delete({email:"notexist@test.com"});
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

    if(!config.sendgrid) {
      done(new Error("no email keys"));
    }
    const emailSender = require('../emailAdapter.js')(config.sendgrid);
    emailSender.send(config.testerEmail)
    .then(result=>{
      expect(result.message).to.equal('success');
      done();
    })
    .catch(err=>{
      done(err);
    });
  });
});
