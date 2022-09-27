'use strict'

module.exports.create = (status, body = {}, additionalHeaders) => {

  return {
    statusCode: status,

    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...additionalHeaders
    },

    body: JSON.stringify(body)
  };

};
