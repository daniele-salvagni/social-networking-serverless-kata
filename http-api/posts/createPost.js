"use strict";

const response = require("../response");

/**
 * Reasons for sing async-await vs callbacks in AWS Lambda
 * https://advancedweb.hu/comparing-async-javascript-functions-and-callbacks-on-aws-lambda/
 */

// Factory function creating and returning the handler function
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
    await deps.dynamo.put(params).promise();
  } catch (error) {
    console.warn(error);
    return response.create(500);
  }
 
  return response.create(201);

};


function getUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}
