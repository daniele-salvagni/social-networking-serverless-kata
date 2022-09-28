'use strict'

const response = require('../response');

/**
 * Responds to a request for getting all posts from a specific user (timeline):
 * - Possible response statuses: 500, 404, 200
 */
module.exports = deps => async (event) => {

  const result = await deps.db.getAllUser(event);

  if (!result) return response.create(500);

  if (!Object.keys(result).length) return response.create(404);

  return response.create(200, result);

};
