'use strict'
/**
 * This class is a wrapper that hides DynamoDB-specific logic and methods,
 * for getting Posts data. This way it will be easy to switch to a
 * different database by simply creating a new wrapper.
 * 
 * With the AWS SDK, it should be assumed that any operation that returns
 * without throwing an exception was successful. In case of exceptions
 * all methods will return null to indicate an internal error.
 */

module.exports = class DynamoPost {
  /**
   * Constructor that accepts a DynamoDB.DocumentClient instance.
   * With this separation it will be easy to switch between cloud/local.
   * @param AWS.DynamoDB.DocumentClient dynamodb 
   */
  constructor(dynamodb) {
    this.db = dynamodb;
  }

  /**
   * Creates a new post in DynamoDB, returns the created object.
   * @param APIGatewayProxyEvent event
   */
  async create(event) {
    const body = JSON.parse(event.body);

    // The server should be responsible for getting the current time
    // when creating a new Post, not the client
    const unixTime = Math.floor(new Date().getTime() / 1000);

    const params = { // new item to be created
      TableName: process.env.DYNAMODB_POST_TABLE,
      Item: {
        username: event.pathParameters.username,
        unixtime: unixTime,
        content: body.content,
      },
    };

    try {
      await this.db.put(params).promise(); // DynamoDB PutItem
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
   * @param APIGatewayProxyEvent event
   */
  async delete(event) {
    const params = { // composite Key of the item to be deleted
      TableName: process.env.DYNAMODB_POST_TABLE,
      Key: {
        username: event.pathParameters.username,
        unixtime: parseInt(event.pathParameters.unixtime),
      },
      // The content of the old item is returned (but not used)
      ReturnValues: 'ALL_OLD'
    };

    try {
      const result = await this.db.delete(params).promise(); // DynamoDB DeleteItem
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
   * If the resource does not exist, it gets created, this has been
   * allowed mainly for making this Kata easier to play with.
   * @param APIGatewayProxyEvent event
   */
  async edit(event) { // composite key and body to be modified
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
      const result = await this.db.update(params).promise(); // DynamoDB UpdateItem

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
   * @param APIGatewayProxyEvent event
   */
  async get(event) {
    const params = { // composite key of the item to be retrieved
      TableName: process.env.DYNAMODB_POST_TABLE,
      Key: {
        username: event.pathParameters.username,
        unixtime: parseInt(event.pathParameters.unixtime),
      },
    };

    try {
      const result = await this.db.get(params).promise(); // DynamoDB GetItem
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
   * @param APIGatewayProxyEvent event
   */
  async getAll(event) {
    const params = { // table to be scanned
      TableName: process.env.DYNAMODB_POST_TABLE,
      ScanIndexForward: false,
    };

    try {
      const result = await this.db.scan(params).promise(); // DynamoDB Scan
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
   * @param APIGatewayProxyEvent event
   */
  async getAllUser(event) {
    const params = { // partition key equals to username
      TableName: process.env.DYNAMODB_POST_TABLE,
  
      ExpressionAttributeValues: {
        ":username": event.pathParameters.username,
      },
      KeyConditionExpression: "username = :username",
      ScanIndexForward: false,
    };

    try {
      const result = await this.db.query(params).promise(); // DynamoDB Query
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
