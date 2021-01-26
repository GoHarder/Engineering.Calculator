// Node Dependencies
const path = require('path');
const fs = require('fs');

// NPM Dependencies
const MailGun = require('mailgun-js');

// Project Dependencies
const config = require('../config/build');
const _logs = require('../logs');

// Module container
const lib = {};

const service = new MailGun({
   apiKey: config.mailGun.apiKey,
   domain: config.mailGun.domain,
});

lib.send = (data, mime) => {
   data['h:sender'] = mime.sender;
   if (mime.replyTo) data['h:Reply-To'] = mime.replyTo;

   return new Promise((res, rej) => {
      service.messages().send(data, (error, body) => {
         if (!error) {
            res(body);
         } else {
            rej(error);
         }
      });
   });
};

lib.sendResetEmail = async (to, data) => {
   const { from: configFrom, sender: configSender } = config.mailGun;

   const from = `no-reply(via Eng Calc) <${configFrom}>`;
   const sender = `no-reply(via Eng Calc) <${configSender}>`;
   const subject = 'Vantage Engineering Calculations | Password Reset Verification Code';
   const html = lib.loadTemplate('reset-password', data);
   const replyTo = undefined;

   const isSent = await lib.send({ from, to, subject, html }, { sender, replyTo });

   return isSent;
};

lib.loadTemplate = (template, data) => {
   let file = '';

   try {
      file = fs.readFileSync(`${__dirname}/${template}.html`, 'utf8');
   } catch (error) {
      _logs.append(error.message);
   }

   for (const key in data) {
      if (data.hasOwnProperty(key)) {
         const find = new RegExp(`{{${key}}}`, 'g');
         file = file.replace(find, data[key]);
      }
   }

   return file;
};

// Export module
module.exports = lib;
