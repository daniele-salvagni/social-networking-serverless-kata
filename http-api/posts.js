/**
 * Lambda functions for handling REST API endpoint requests
 * related to posts.
 */
'use strict';

const dynamodbClient = require('serverless-dynamodb-client');

const dynamodb = dynamodbClient.doc;
const postTable = process.env.DYNAMODB_POST_TABLE;


function getUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}

 
module.exports.createPost = async (event) => {
  const body = JSON.parse(event.body);

  const createPostParams = {
    TableName: postTable,
    Item: {
      username: event.pathParameters.username,
      unixtime: getUnixTime(),
      content: body.content,
    },
  };

  await dynamodb.put(createPostParams).promise();
 
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
  const getParams = {
    TableName: postTable,
    ExpressionAttributeValues: {    
      ':username': event.pathParameters.username,
    },
    KeyConditionExpression: 'username = :username',
  };

  const result = await dynamodb.query(getParams).promise();

  if (result.Count === 0) {
    return {
      statusCode: 404,
    };
  }
 
  return {  // move responses in a separate file?
    statusCode: 200,
    body: JSON.stringify({
      total: result.Count,
      items: await result.Items.map((post) => {
        return {
          time: post.unixtime,
          username: post.username,
          content: post.content,
        };
      }),
    }),
  };
};
