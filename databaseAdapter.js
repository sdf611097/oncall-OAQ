'use strict';

//ToDo set this class as interface to use another db

var mongo = require('ct-promised-mongo');

function dataFormatCheck(){
  return true;
}

function insertOne(data){
  if(dataFormatCheck(data)){
    return mongo.insertOne("User",data);
  }else{
    console.error("wrong format", data);
    return Promise.reject(new Error("data format is incorrect"));
  }
}

function insertMulti(list){
  if(list && list.length>0){
    //ToDo: response all wrong format datas
    return Promise.all(list.map(insertOne));
  }else{
    return Promise.reject(new Error("wrong format of insertMulti"));
  }
}

function findOne(email){
  if(email.indexOf('@')>-1){
    return mongo.findOne("User", {email:email});
  }else {
    return Promise.reject(new Error("not an email"));
  }
}

function deleteMany(email){
  return mongo.deleteMany("User", {email:email});
}

module.exports = function(uri){
  console.log('uri??', uri);
  mongo.getConnectPromise(uri)
  .then(db=>{
    console.log('db is connected');

  })
  .catch(err=>{
    console.log('connection fail');
    //ToDo deal with connect failed case
    process.exit(1);
  });
  return {
    insert: insertMulti,
    find: findOne,
    delete: deleteMany
  };

};
