'use strict';

const response = require('../response');

/**
 * Reasons for sing async-await vs callbacks in AWS Lambda
 * https://advancedweb.hu/comparing-async-javascript-functions-and-callbacks-on-aws-lambda/
 */

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
    process.env.IS_OFFLINE && console.log("PutItem success");

    return response.create(201);

  } catch (error) {
    process.env.IS_OFFLINE && console.warn("PutItem error =", error);
    return response.create(500);
  }

};


function getUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}
