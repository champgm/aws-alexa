import 'babel-polyfill';

console.log('importing');

const request = require('request');

module.exports.handler = async function handler(event, context, callback) {
  console.log('BEGIN PROCESSING');
  console.log(`Message: ${JSON.stringify(event)}`);
  const urlPrefix = process.env.HIT_URL;

  // "request": {
  //   "type': 'IntentRequest',
  //   "requestId': 'EdwRequestId.4ac7b73a-b9bb-4ce1-876a-9b1ee2615a44',
  //   "timestamp': '2017-02-05T01:18:14Z',
  //   "locale': 'en-US',
  //   "intent": {
  //       "name': 'lights',
  //       "slots": {
  //           "Scene": {
  //               "name': 'Scene',
  //               "value': 'red"

  let endpoint = process.env.SECRET_WHITE;
  if (event.request.intent) {
    const scene = event.request.intent.slots.Scene.value;
    switch (scene) {
      case 'red':
        endpoint = process.env.SECRET_RED;
        break;
      case 'white':
        endpoint = process.env.SECRET_WHITE;
        break;
      case 'off':
        endpoint = process.env.SECRET_OFF;
        break;
      case 'on':
        endpoint = process.env.SECRET_WHITE;
        break;
      default:
        endpoint = process.env.SECRET_WHITE;
        break;
    }
  }

  const url = `${urlPrefix}/${endpoint}`;

  console.log(`Contacting URL: ${url}`);
  try {
    request(url, (error, response, body) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      console.log(`Response: ${JSON.stringify(response)}`);
      console.log(`Body: ${JSON.stringify(body)}`);
      if (!error && response.statusCode === 200) {
        console.log(body);
      }
    });
  } catch (error) {
    console.log(`Error fetching URL: ${JSON.stringify(error)}`);
    throw new Error(error);
  }

  const response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: 'Done!'
      },
      reprompt: {
        outputSpeech: {
          type: 'PlainText',
          text: null
        }
      },
      shouldEndSession: true
    }
  };

  callback(null, response);
};
