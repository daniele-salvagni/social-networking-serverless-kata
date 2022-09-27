"use strict";

const dynamodb = require('../../database/dynamodb');
const response = require("../response");
const db = dynamodb.documentClient;


module.exports.getUserPosts = async (event) => {

  const params = {
    TableName: process.env.DYNAMODB_POST_TABLE,

    ExpressionAttributeValues: {
      ":username": event.pathParameters.username,
    },
    KeyConditionExpression: "username = :username",
  };

  const result = await db.query(params).promise();

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
