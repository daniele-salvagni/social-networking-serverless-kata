'use strict'
/**
 * This module is responsible for creating an APIGatewayProxyResponse
 * This will automatically add some default headers like:
 * - "Content-Type": "application/json"
 * 
 * @param status the status code of the http response (200, 404, ...)
 * @param body an object representing the response body to be stringified
 * @param additionalHeaders an object containing additional headers
 * @returns the APIGatewayProxyResponse
 */
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
