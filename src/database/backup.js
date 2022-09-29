'use strict';

// var DynamoBackup = require('dynamo-backup-to-s3');
// var moment = require('moment');

const Backup = require('dynamodb-backup-restore').Backup;

exports.handler = function (event, context, callback) {

	const config = {
		// TODO: Use variables and fix names
		S3Bucket:     'dynamo-backup-qwerty',                   /* required */
		S3Region:     'eu-west-3',                     /* required */
		DbTable:      process.env.DYNAMODB_POST_TABLE, /* required */
		DbRegion:     'eu-west-3'                      /* required */
	};
	const backup = new Backup(config);
	backup.full();
	
};
