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

function findOne(query){
  //ToDo, multi fit, random choose one
  return mongo.findOne("User", query);
}

function deleteMany(query){
  return mongo.deleteMany("User", query);
}

module.exports = function(uri){
  mongo.getConnectPromise(uri)
  .then(db=>{
    console.log(uri, 'db is connected');

  })
  .catch(err=>{
    console.log(uri, 'connection fail');
    //ToDo deal with connect failed case
    process.exit(1);
  });
  return {
    insert: insertMulti,
    find: findOne,
    delete: deleteMany
  };

};
