'use strict'


class DynamoPost {

  constructor(dynamodb) {
    this.db = dynamodb;
  }

  /**
   * Creates a new post in DynamoDB, returns the created object.
   */
  async create(event) {
    const body = JSON.parse(event.body);
    const unixTime = getUnixTime();

    const params = {
      TableName: process.env.DYNAMODB_POST_TABLE,
  
      Item: {
        username: event.pathParameters.username,
        unixtime: unixTime,
        content: body.content,
      },
    };

    try {
      // DynamoDB PutItem
      await this.db.put(params).promise();
      process.env.IS_OFFLINE && console.log("PutItem success");
      return { // DyanmoDB doen NOT return a response for new items, so we build one
        post: {
          username: event.pathParameters.username,
          unixtime: unixTime,
          content: body.content,
        }
      }
    } catch (error) {
      console.warn("PutItem error =", error);
      return null;
    }
  }

  /**
   * Deletes a post from DynamoDB, returns the deleted object:
   */
  async delete(event) {
    const params = {
      TableName: process.env.DYNAMODB_POST_TABLE,
      Key: {
        username: event.pathParameters.username,
        unixtime: parseInt(event.pathParameters.unixtime),
      },
      // The content of the old item is returned
      ReturnValues: 'ALL_OLD'
    };

    try {
      // DynamoDB DeleteItem
      const result = await this.db.delete(params).promise();
      if (!result.Attributes) return {};

      process.env.IS_OFFLINE && console.log("DeleteItem success");
      return {
        post: {
          username: result.Attributes.username,
          unixtime: result.Attributes.unixtime,
          content: result.Attributes.content,
        }
      }
    } catch (error) {
      console.warn("DeleteItem error =", error);
      return null;
    }
  }

/**
   * Updates a post from DynamoDB, returns the updated object.
   * If the resource does not exist, it gets created.
   */
  async edit(event) {
    const body = JSON.parse(event.body);

    const params = {
      TableName: process.env.DYNAMODB_POST_TABLE,
      Key: {
        username: event.pathParameters.username,
        unixtime: parseInt(event.pathParameters.unixtime),
      },
      ExpressionAttributeValues: {
          ":c": body.content,
      },
      UpdateExpression: "set content = :c",
  
      // Returns all of the attributes of the updated item
      ReturnValues: 'ALL_NEW'
    };

    try {
      // DynamoDB UpdateItem
      const result = await this.db.update(params).promise();

      process.env.IS_OFFLINE && console.log("UpdateItem success");
      return {
        post: {
          username: result.Attributes.username,
          unixtime: result.Attributes.unixtime,
          content: result.Attributes.content,
        }
      }
    } catch (error) {
      console.warn("UpdateItem error =", error);
      return null;
    }
  }
  
  /**
   * Gets and returns a post from DynamoDB.
   */
  async get(event) {
    const params = {
      TableName: process.env.DYNAMODB_POST_TABLE,
      Key: {
        username: event.pathParameters.username,
        unixtime: parseInt(event.pathParameters.unixtime),
      },
    };

    try {
      // DynamoDB GetItem
      const result = await this.db.get(params).promise();
      if (!result.Item) return {};

      process.env.IS_OFFLINE && console.log("GetItem success");
      return {
        post: {
          username: result.Item.username,
          unixtime: result.Item.unixtime,
          content: result.Item.content,
        }
      }
    } catch (error) {
      console.warn("GetItem error =", error);
      return null;
    }
  }

  /**
   * Gets and returns all posts from DynamoDB.
   */
  async getAll(event) {
    const params = {
      TableName: process.env.DYNAMODB_POST_TABLE,
    };

    try {
      // DynamoDB Scan
      const result = await this.db.scan(params).promise();
      if (!result.Count === 0) return {};

      process.env.IS_OFFLINE && console.log("Scan success");
      return {
        total: result.Count,
        posts: result.Items.map((post => ({
          username: post.username,
          unixtime: post.unixtime,
          content: post.content,
        }))),
      }
    } catch (error) {
      console.warn("Scan error =", error);
      return null;
    }
  }

  /**
   * Gets and returns an user's timeline from DynamoDB.
   */
  async getAllUser(event) {
    const params = {
      TableName: process.env.DYNAMODB_POST_TABLE,
  
      ExpressionAttributeValues: {
        ":username": event.pathParameters.username,
      },
      KeyConditionExpression: "username = :username",
    };

    try {
      // DynamoDB Query
      const result = await this.db.query(params).promise();
      if (!result.Count === 0) return {};

      process.env.IS_OFFLINE && console.log("Query success");
      return {
        total: result.Count,
        posts: result.Items.map((post => ({
          username: post.username,
          unixtime: post.unixtime,
          content: post.content,
        }))),
      }
    } catch (error) {
      console.warn("Query error =", error);
      return null;
    }
  }
}


function getUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}

module.exports = DynamoPost;
