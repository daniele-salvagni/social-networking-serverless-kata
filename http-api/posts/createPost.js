"use strict";

// const dynamodb = require('../../database/dynamodb');
const response = require("../response");
// const db = dynamodb.documentClient;

// Using async-await vs callbacks in AWS Lambda
// https://advancedweb.hu/comparing-async-javascript-functions-and-callbacks-on-aws-lambda/

module.exports = deps => async (event) => {
  const body = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_POST_TABLE,

    Item: {
      username: event.pathParameters.username,
      unixtime: getUnixTime(),
      content: body.content,
    },
  };

  try {
    // Promisify or lambda will exit
    await deps.dynamo.put(params).promise();
  } catch (error) {
    //console.log??
  }
 
  return response.create(201);

};


function getUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}
