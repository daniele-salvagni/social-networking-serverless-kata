'use strict';

const Backup = require('dynamodb-backup-restore').Backup;

exports.handler = function (event, context, callback) {

	const config = {
		S3Bucket:     process.env.BACKUP_S3_BUCKET,     /* required */
		S3Region:     process.env.REGION,               /* required */
		DbTable:      process.env.DYNAMODB_POST_TABLE,  /* required */
		DbRegion:     process.env.REGION,               /* required */
	};
	const backup = new Backup(config);
	backup.full();

};
