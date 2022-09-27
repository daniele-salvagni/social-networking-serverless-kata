'use strict';

/**
 * The general idea and some of the code is from this plugin:
 * https://github.com/99x/serverless-dynamodb-client/blob/master/src/index.js
 */

const AWS = require('aws-sdk');

const HOST = process.env.LOCAL_DDB_HOST || 'localhost';
const PORT = process.env.LOCAL_DDB_PORT || 8000;
const ENDPOINT = `http://${HOST}:${PORT}`;

const OFFLINE_OPTIONS = {
    region: 'localhost',
    endpoint: ENDPOINT,
    accessKeyId: 'MOCK_ACCESS_KEY_ID',
    secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
};

const IS_OFFLINE = process.env.IS_OFFLINE || process.env.IS_LOCAL;

exports.documentClient = IS_OFFLINE
  ? new AWS.DynamoDB.DocumentClient(OFFLINE_OPTIONS)
  : new AWS.DynamoDB.DocumentClient();
