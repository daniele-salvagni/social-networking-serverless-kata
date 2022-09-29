'use strict'

const response = require('../response');

/**
 * Responds to a request for modifying a post:
 * - Possible statuses: 500, 200
 * In case of success the Location header will point to the edited post
 */
module.exports = deps => async (event) => {

  const result = await deps.db.edit(event);

  if (!result) return response.create(500);

  const locationHeader = `/posts/${result.post.username}/${result.post.unixtime}`;
  return response.create(200, result, { "Location": locationHeader });

};
