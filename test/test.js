'use strict';
const expect = require('chai').expect;
const request = require('request');
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
