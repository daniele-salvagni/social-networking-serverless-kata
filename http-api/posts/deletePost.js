'use strict'

const response = require('../response');


module.exports = deps => async (event) => {

  const result = await deps.db.delete(event);

  if (!result) return response.create(500);

  // Object to delete not found
  if (!Object.keys(result).length) return response.create(404);

  // It is best to send no response body, just a 204 is ok
  return response.create(204);

};
