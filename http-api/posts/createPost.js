'use strict'

const response = require('../response');

// Reasons for sing async-await vs callbacks in AWS Lambda
// https://advancedweb.hu/comparing-async-javascript-functions-and-callbacks-on-aws-lambda/

/**
 * Responds to a request for creating a new post:
 * - Possible response statuses: 500, 201
 * In case of success the Location header will point to the new post
 */
module.exports = deps => async (event) => {

  const result = await deps.db.create(event);
  
  if (!result) return response.create(500);

  // Location of the newly created post for the Location header
  const locationHeader = `/posts/${result.post.username}/${result.post.unixtime}`;
  return response.create(201, result, { "Location": locationHeader });

};
