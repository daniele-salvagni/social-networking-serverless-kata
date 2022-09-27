"use strict";

const response = require("../response");


module.exports = deps => async (event) => {

  const params = {
    TableName: process.env.DYNAMODB_POST_TABLE,
  };

  let result;

  try {
    result = await deps.dynamo.scan(params).promise();
    process.env.IS_OFFLINE && console.log("Scan success");

    if (result.Count === 0) {
      process.env.IS_OFFLINE && console.info("No results found");
      return response.create(404);
    }
    
    return response.create(200, {
      total: result.Count,
      posts: result.Items.map((post) => ({
        username: post.username,
        unixtime: post.unixtime,
        content: post.content,
      })),
    });

  } catch (error) {
    process.env.IS_OFFLINE && console.warn("Scan error =", error);
    return response.create(500);
  }

};
