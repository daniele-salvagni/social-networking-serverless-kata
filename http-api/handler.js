'use strict'
const DynamodbPostWrapper = require('./database/DynamoPostWrapper')
const dynamodb = require('./database/dynamodb');

/**
 * Inject dependencies and link the endpoint to its module.
 * https://blog.codecentric.de/en/2019/02/testable-lambda/
 */

const postWrapper = new DynamodbPostWrapper(dynamodb.documentClient);

module.exports.createPost = require('./posts/createPost')({
  db: postWrapper,
});

module.exports.deletePost = require('./posts/deletePost')({
  db: postWrapper,
});

module.exports.editPost = require('./posts/editPost')({
  db: postWrapper,
});

module.exports.getPost = require('./posts/getPost')({
  db: postWrapper,
});

module.exports.getAllPosts = require('./posts/getAllPosts')({
  db: postWrapper,
});

module.exports.getUserPosts = require('./posts/getUserPosts')({
  db: postWrapper,
});
