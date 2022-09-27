'use strict'

const response = require('../response');


module.exports = deps => async (event) => {

  const result = await deps.db.get(event);

  if (!result) return response.create(500);

  if (!Object.keys(result).length) return response.create(404);

  return response.create(200, result);

};
