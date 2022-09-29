'use strict'
/**
 * The following unit-tests are testing if the handler will return the correct
 * http responses depending on what is returned from the database.
 * 
 * jest-each has been used to reuse the same tests on different methods.
 */

// Mock the database wrapper
const postWrapperMock = jest.fn();

// Import the functions to be tested and inject the mocked wrapper
const createPost      = require("../src/posts/createPost")      ({ db: postWrapperMock });
const deletePost      = require("../src/posts/deletePost")      ({ db: postWrapperMock });
const editPost        = require("../src/posts/editPost")        ({ db: postWrapperMock });
const getAllPosts     = require("../src/posts/getAllPosts")     ({ db: postWrapperMock });
const getAllUserPosts = require("../src/posts/getAllUserPosts") ({ db: postWrapperMock });
const getPost         = require("../src/posts/getPost")         ({ db: postWrapperMock });

// Mock the database wrapper methods
postWrapperMock.create     = jest.fn();
postWrapperMock.delete     = jest.fn();
postWrapperMock.edit       = jest.fn();
postWrapperMock.getAll     = jest.fn();
postWrapperMock.getAllUser = jest.fn();
postWrapperMock.get        = jest.fn();

// A mock result of getting a single post from the database
const DB_RESULT  = { post: { username: "u", unixtime: 10, content: "c" }};

// A mock result of getting multiple posts from the database
const DB_RESULTS = { total: 2,
                     posts: [ { username: "u1", unixtime: 11, content: "c1" },
                              { username: "u2", unixtime: 12, content: "c2" }, ], };

// The body of the response should match what is returned from the database
const EXP_POST_BODY  = DB_RESULT;
const EXP_POSTS_BODY = DB_RESULTS;

// The expected location header for a DB_RESULT
const EXP_LOCATION = { "Location": "/posts/u/10" };

/**
 * Methods that should return 500 in case of null result from db
 */
const NULL_STATUS = [
  [ "createPost",      500, null, createPost,      postWrapperMock.create     ],
  [ "deletePost",      500, null, deletePost,      postWrapperMock.delete     ],
  [ "editPost",        500, null, editPost,        postWrapperMock.edit       ],
  [ "getAllPosts",     500, null, getAllPosts,     postWrapperMock.getAll     ],
  [ "getAllUserPosts", 500, null, getAllUserPosts, postWrapperMock.getAllUser ],
  [ "getPost",         500, null, getPost,         postWrapperMock.get        ],
];

describe("status code if result is null", () => {
  test.each(NULL_STATUS)(
    "%s should return %s",
    async (funcName, expectedCode, mockedDbResponse, testedFunc, mockedDbFunc) => {
      mockedDbFunc.mockReturnValue(mockedDbResponse);
      const result = await testedFunc();
      expect(result).toEqual(expect.objectContaining({ statusCode: expectedCode }));
    }
  )
});

/**
 * Methods that should return 404 in case of empty object from db
 */
const EMPTY_STATUS = [
  [ "deletePost",      404, {}, deletePost,      postWrapperMock.delete     ],
  [ "getAllPosts",     404, {}, getAllPosts,     postWrapperMock.getAll     ],
  [ "getAllUserPosts", 404, {}, getAllUserPosts, postWrapperMock.getAllUser ],
  [ "getPost",         404, {}, getPost,         postWrapperMock.get        ],
];

describe("status code if result is empty", () => {
  test.each(EMPTY_STATUS)(
    "%s should return %s",
    async (funcName, expectedCode, mockedDbResponse, testedFunc, mockedDbFunc) => {
      mockedDbFunc.mockReturnValue(mockedDbResponse);
      const result = await testedFunc();
      expect(result).toEqual(expect.objectContaining({ statusCode: expectedCode }));
    }
  );
});

/**
 * Methods that should return a success (20x) code
 */
const SUCCESS_STATUS = [
  [ "createPost",      201, DB_RESULT,  createPost,      postWrapperMock.create     ],
  [ "deletePost",      204, DB_RESULT,  deletePost,      postWrapperMock.delete     ],
  [ "editPost",        200, DB_RESULT,  editPost,        postWrapperMock.edit       ],
  [ "getAllPosts",     200, DB_RESULTS, getAllPosts,     postWrapperMock.getAll     ],
  [ "getAllUserPosts", 200, DB_RESULTS, getAllUserPosts, postWrapperMock.getAllUser ],
  [ "getPost",         200, DB_RESULT,  getPost,         postWrapperMock.get        ],
];

describe("status code if success", () => {
  test.each(SUCCESS_STATUS)(
    "%s should return %s",
    async (funcName, expectedCode, mockedDbResponse, testedFunc, mockedDbFunc) => {
      mockedDbFunc.mockReturnValue(mockedDbResponse);
      const result = await testedFunc();
      expect(result).toEqual(expect.objectContaining({ statusCode: expectedCode }));
    }
  );
});

/**
 * Methods that should return some body on success
 */
const SUCCESS_BODY = [
  [ "createPost",      EXP_POST_BODY,  DB_RESULT,  createPost,      postWrapperMock.create     ],
  [ "deletePost",      {},             DB_RESULT,  deletePost,      postWrapperMock.delete     ],
  [ "editPost",        EXP_POST_BODY,  DB_RESULT,  editPost,        postWrapperMock.edit       ],
  [ "getAllPosts",     EXP_POSTS_BODY, DB_RESULTS, getAllPosts,     postWrapperMock.getAll     ],
  [ "getAllUserPosts", EXP_POSTS_BODY, DB_RESULTS, getAllUserPosts, postWrapperMock.getAllUser ],
  [ "getPost",         EXP_POST_BODY,  DB_RESULT,  getPost,         postWrapperMock.get        ],
];

describe("correct body if success", () => {
  test.each(SUCCESS_BODY)(
    "%s should return the correct JSON body",
    async (funcName, expectedBody, mockedDbResponse, testedFunc, mockedDbFunc) => {
      mockedDbFunc.mockReturnValue(mockedDbResponse);
      const result = JSON.parse((await testedFunc()).body);
      expect(result).toMatchObject(expectedBody);
    }
  );
});

/**
 * Methods that should return a Location header when a resource is created
 */
const SUCCESS_LOCATION = [
  [ "createPost",      EXP_LOCATION, DB_RESULT, createPost, postWrapperMock.create ],
  [ "editPost",        EXP_LOCATION, DB_RESULT, editPost,   postWrapperMock.edit   ],
];

describe("correct location header if created", () => {
  test.each(SUCCESS_LOCATION)(
    "%s should return the correct Location header",
    async (funcName, expectedHeader, mockedDbResponse, testedFunc, mockedDbFunc) => {
      mockedDbFunc.mockReturnValue(mockedDbResponse);
      const result = (await testedFunc()).headers;
      expect(result).toEqual(expect.objectContaining(expectedHeader));
    }
  );
});
