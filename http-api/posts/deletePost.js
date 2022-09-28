'use strict'

const response = require('../response');

/**
 * Responds to a request for creating a new post:
 * - Possible response statuses: 500, 404, 204
 */
module.exports = deps => async (event) => {

  const result = await deps.db.delete(event);

  if (!result) return response.create(500);

  // Object to be deleted not found
  if (!Object.keys(result).length) return response.create(404);

  // It is best to send no response body for deleting an item,
  // just the status should be enough
  return response.create(204);

};
