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

  try {
    const result = await deps.dynamo.query(params).promise();
  } catch (error) {
    
  }

  if (result.Count === 0) return response.create(404);

  return response.create(200, {
    total: result.Count,
    posts: result.Items.map((post) => {
      return {
        time: post.unixtime,
        username: post.username,
        content: post.content,
      };
    }),});

};
