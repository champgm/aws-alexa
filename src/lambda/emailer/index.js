import 'babel-polyfill';

const AWS = require('aws-sdk');

const environmentVariables = process.env;

console.log('Doing something...');


module.exports.handler = async function handler(event, context, callback) {
  console.log('BEGIN');

  const eventText = JSON.stringify(event, null, 2);
  console.log('Received event:', eventText);
  console.log(`Will try to send to: ${environmentVariables.EMAILER_SNS}`);
  const sns = new AWS.SNS({ region: 'us-west-2' });
  const params = {
    Message: eventText,
    Subject: 'Reminder',
    TopicArn: environmentVariables.EMAILER_SNS
  };
  sns.publish(params, (thing) => {
    console.log('Tried to publish...');
    console.log(`Thjing: ${thing}`);
  });

  callback(null, 'DONE');
};
