'use strict';
/**
 * This module returns the correct DynamoDB instance for deployment on:
 * - a Cloud AWS DynamoDB instance (env. variables)
 * - a Local DynamoDB instance (env. variables or defaults to http://localhost:8000)
 * 
 * The general idea and some of the code comes from this svs plugin:
 * https://github.com/99x/serverless-dynamodb-client/blob/master/src/index.js
 */

const AWS = require('aws-sdk');

const HOST = process.env.LOCAL_DDB_HOST || 'localhost';
const PORT = process.env.LOCAL_DDB_PORT || 8000;
const ENDPOINT = `http://${HOST}:${PORT}`;

// options to be used for the Local DynamoDB instance
const OFFLINE_OPTIONS = {
  endpoint: ENDPOINT,
  region: 'eu-west-3',
  accessKeyId: 'MOCK_ACCESS_KEY_ID',
  secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
};

// process.env.IS_OFFLINE will be true if `sls offline start` is used
const IS_OFFLINE = process.env.IS_OFFLINE || process.env.IS_LOCAL;

exports.documentClient = IS_OFFLINE
  ? new AWS.DynamoDB.DocumentClient(OFFLINE_OPTIONS)
  : new AWS.DynamoDB.DocumentClient();
