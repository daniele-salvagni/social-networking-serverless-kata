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
    // The content of the old item is returned
    ReturnValues: 'ALL_OLD'
  };

  try {
    const result = await deps.dynamo.delete(params).promise();
    console.log("DeleteItem success =", result);
    return response.create(201);

  } catch (error) {
    console.warn("DeleteItem error =", error);
    return response.create(500);
  }

};
