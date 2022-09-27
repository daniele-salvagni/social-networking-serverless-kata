"use strict";

const dynamodb = require('../../database/dynamodb');
const response = require("../response");
const db = dynamodb.documentClient;
 

module.exports.createPost = async (event) => {
  const body = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_POST_TABLE,

    Item: {
      username: event.pathParameters.username,
      unixtime: getUnixTime(),
      content: body.content,
    },
  };

  await db.put(params).promise();
 
  return response.create(201);

};


function getUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}
