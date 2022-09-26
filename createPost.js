'use strict';
const AWS = require('aws-sdk');
 
module.exports.createPost = async (event) => {
  const body = JSON.parse(Buffer.from(event.body, 'base64').toString());
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const putParams = {
    TableName: process.env.DYNAMODB_POST_TABLE,
    Item: {
      username: body.username,
      timestamp: Math.floor(new Date().getTime() / 1000),
      content: body.content
    },
  };

  await dynamoDb.put(putParams).promise();
 
  return {
    statusCode: 201,
  };
};
