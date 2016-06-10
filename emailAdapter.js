'use strict';

let sendgrid;

function sendEmail(toUserEmail){
  return new Promise((resolve, reject)=>{
    let email = new sendgrid.Email({
      to: toUserEmail,
      from: 'oncall-OAQ',
      subject: 'This is subject',
      text: 'Dear poor guy:\n \tOAQ\n BR.\n Boss'
    });
    sendgrid.send(email, function(err, json){
      if(err) {
        console.log('err', err, json);
        reject(err);
      } else {
        resolve(json);
      }
    });
  });
}

module.exports = function(key){
  sendgrid = require('sendgrid')(key);
  return {
    send: sendEmail
  };
};
