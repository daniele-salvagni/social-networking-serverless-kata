'use strict'
/**
 * Integration tests verifying correct comunication between local
 * DynamoDB, Gateway API and Http requests.
 */

const fetch = require('node-fetch-commonjs');

const BASE_URL = "http://localhost:3000";

const USER = "testUser";
const BODY  = { content: "Lorem ipsum" };

describe("create a post, get it using the location header", () => {

  test("should return the created content", async () => {

    // Create a new post
    const createResponse = await fetch(`${BASE_URL}/posts/${USER}`, {
      method: "post",
      body: JSON.stringify(BODY),
      headers: {"Content-Type": "application/json"}
    });
  
    // Get the location header from the response
    const locationHeader = createResponse.headers.get('location')

    // Retrieve the post by using the location header URL
    const getResponse = await fetch(`${BASE_URL}${locationHeader}`, {
      method: "get",
      headers: {"Content-Type": "application/json"}
    });

    const data = await getResponse.json();
    const returnedContent = data.post.content;

    expect(returnedContent).toBe(BODY.content); // "Lorem ipsum"

  });

});

/**
 * All the other endpoints could be tested in the same way
 * ...
 */
