'use strict';

const response = require('../response');


module.exports = deps => async (event) => {

  const body = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_POST_TABLE,
    Key: {
      username: event.pathParameters.username,
      unixtime: parseInt(event.pathParameters.unixtime),
    },
    ExpressionAttributeValues: {
        ":c": body.content,
    },
    UpdateExpression: "set content = :c",

    // Returns all of the attributes of the updated item
    ReturnValues: 'ALL_NEW'
  };

  try {
    const result = await deps.dynamo.update(params).promise();
    console.log("UpdateItem success =", result);
    return response.create(201, result);
  } catch (error) {
    console.warn("UpdateItem error =", error);
    return response.create(500);
  }

};
