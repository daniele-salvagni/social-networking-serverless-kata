"use strict";

const response = require("../response");


module.exports = deps => async (event) => {

  const params = {
    TableName: process.env.DYNAMODB_POST_TABLE,

    ExpressionAttributeValues: {
      ":username": event.pathParameters.username,
    },
    KeyConditionExpression: "username = :username",
  };

  let result;

  try {
    result = await deps.dynamo.query(params).promise();
  } catch (error) {
    console.warn(error);
    return response.create(500);
  }

  if (result.Count === 0) return response.create(404);

  return response.create(200, {
    total: result.Count,
    posts: result.Items.map((post) => ({
      time: post.unixtime,
      username: post.username,
      content: post.content,
    })),
  });

};
