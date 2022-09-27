'use strict'

const response = require('../response');


module.exports = deps => async (event) => {

  const result = await deps.db.edit(event);

  if (!result) return response.create(500);

  const locationHeader = `/posts/${result.post.username}/${result.post.unixtime}`;
  return response.create(200, result, { "Location": locationHeader });

};
