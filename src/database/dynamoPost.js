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
    // The server is responsible for getting the current time when creating a new Post
    const unixTime = Math.floor(new Date().getTime() / 1000);

    const body = JSON.parse(event.body);
    const params = { // new item to be created
      TableName: process.env.DYNAMODB_POST_TABLE,
      Item: {
        username: event.pathParameters.username,
        unixtime: unixTime,
        content: body.content,
      },
    };

    const result = await this._tryAction(this.db.put(params).promise());
    if (result == null) return null;
    return { // DyanmoDB doen NOT return the created item in the response
      post: params.Item,
    }
  }

  /**
   * Deletes a post from DynamoDB, returns the deleted object:
   * @param APIGatewayProxyEvent event
   */
  async delete(event) {
    const params = { // composite Key of the item to be deleted
      TableName: process.env.DYNAMODB_POST_TABLE,
      Key: { username: event.pathParameters.username, unixtime: parseInt(event.pathParameters.unixtime) },
      ReturnValues: 'ALL_OLD' // The content of the old item is returned (but not used)
    };

    const result = await this._tryAction(this.db.delete(params).promise());

    if (result == null) return null;
    if (!result.Attributes) return {};
    return {
      post: {
        username: result.Attributes.username,
        unixtime: result.Attributes.unixtime,
        content: result.Attributes.content,
      }
    }
  }

/**
   * Updates a post from DynamoDB, returns the updated object.
   * If the resource does not exist, it gets created, this has been
   * allowed mainly for making this Kata easier to play with.
   * @param APIGatewayProxyEvent event
   */
  async edit(event) {
    const body = JSON.parse(event.body);

    const params = {  // composite key and body to be modified
      TableName: process.env.DYNAMODB_POST_TABLE,
      Key: { username: event.pathParameters.username, unixtime: parseInt(event.pathParameters.unixtime) },
      ExpressionAttributeValues: { ":c": body.content },
      UpdateExpression: "set content = :c",
      ReturnValues: 'ALL_NEW' // Returns all of the attributes of the updated item
    };

    const result = await this._tryAction(this.db.update(params).promise());

    if (result == null) return null;
    return {
      post: {
        username: result.Attributes.username,
        unixtime: result.Attributes.unixtime,
        content: result.Attributes.content,
      }
    }
  }
  
  /**
   * Gets and returns a post from DynamoDB.
   * @param APIGatewayProxyEvent event
   */
  async get(event) {
    const params = { // composite key of the item to be retrieved
      TableName: process.env.DYNAMODB_POST_TABLE,
      Key: { username: event.pathParameters.username, unixtime: parseInt(event.pathParameters.unixtime) },
    };

    const result = await this._tryAction(this.db.get(params).promise());

    if (result == null) return null;
    if (!result.Item) return {};
    return {
      post: {
        username: result.Item.username,
        unixtime: result.Item.unixtime,
        content: result.Item.content,
      }
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

    const result = await this._tryAction(this.db.scan(params).promise());

    if (result == null) return null;
    if (result.Count == 0) return {};
    return {
      total: result.Count,
      posts: result.Items.map((post => ({
        username: post.username,
        unixtime: post.unixtime,
        content: post.content,
      }))),
    };
  }

  /**
   * Gets and returns an user's timeline from DynamoDB.
   * @param APIGatewayProxyEvent event
   */
  async getAllUser(event) {
    const params = { // partition key equals to username
      TableName: process.env.DYNAMODB_POST_TABLE,
      ExpressionAttributeValues: { ":username": event.pathParameters.username },
      KeyConditionExpression: "username = :username",
      ScanIndexForward: false,
    };

    const result = await this._tryAction(this.db.query(params).promise());

    if (result == null) return null;
    if (result.Count == 0) return {};
    return {
      total: result.Count,
      posts: result.Items.map((post => ({
        username: post.username,
        unixtime: post.unixtime,
        content: post.content,
      }))),
    };
  }

  /**
   * Tries to execute an Action on the database, returns the result or null in case of error.
   */
  async _tryAction(action) {
    try {
      return await action;
    } catch (error) {
      console.warn("DB Action Error =", error);
      return null;
    }
  }
}
