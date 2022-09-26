/**
 * Lambda functions for handling REST API endpoint requests
 * related to posts.
 */
'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
 
module.exports.createPost = async (event) => {
  const body = JSON.parse(Buffer.from(event.body, 'base64').toString());
  const putParams = {
    TableName: process.env.DYNAMODB_POST_TABLE,
    Item: {
      username: event.pathParameters.username,
      timestamp: Math.floor(new Date().getTime() / 1000),
      content: body.content
    },
  };

  await dynamoDb.put(putParams).promise();
 
  return {
    statusCode: 201,
  };
};


module.exports.getPost = async (event) => {

    return {
      statusCode: 201,
    };
  };

module.exports.editPost = async (event) => {

    return {
      statusCode: 201,
    };
  };

module.exports.deletePost = async (event) => {

    return {
      statusCode: 201,
    };
  };

module.exports.getUserPosts = async (event) => {

    return {
      statusCode: 201,
    };
  };
