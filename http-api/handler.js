'use strict'

/**
 * A simple way of injecting dependencies in Lambda functions
 * Idea taken from this post: https://blog.codecentric.de/en/2019/02/testable-lambda/
 */

const dynamodb = require('../database/dynamodb');

module.exports.createPost = require('./posts/createPost')({
  dynamo: dynamodb.documentClient
});

module.exports.deletePost = require('./posts/deletePost')({
  dynamo: dynamodb.documentClient
});

module.exports.editPost = require('./posts/editPost')({
  dynamo: dynamodb.documentClient
});

module.exports.getPost = require('./posts/getPost')({
  dynamo: dynamodb.documentClient
});

module.exports.getPosts = require('./posts/getPosts')({
  dynamo: dynamodb.documentClient
});

module.exports.getUserPosts = require('./posts/getUserPosts')({
  dynamo: dynamodb.documentClient
});
