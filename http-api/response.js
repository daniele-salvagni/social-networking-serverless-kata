'use strict'

module.exports.create = (status, data = {}) => {

  return {
    statusCode: status,

    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },

    body: JSON.stringify(data)
  };

};
