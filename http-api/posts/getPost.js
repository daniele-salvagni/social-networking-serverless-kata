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
  };

  try {
    const result = await deps.dynamo.get(params).promise();
    console.log("GetItem success =", result);
    if (!result.Item) {
        process.env.IS_OFFLINE && console.info("No results found");
        return response.create(404);
      }
    return response.create(201, result);
  } catch (error) {
    console.warn("GetItem error =", error);
    return response.create(500);
  }

};
