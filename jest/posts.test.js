'use strict'

const postWrapperMock = jest.fn();


const getPost = require("../http-api/posts/getPost")({
  db: postWrapperMock,
});
postWrapperMock.get = jest.fn();

const POST_RESPONSE = { post: { username: "u", unixtime: 10, content: "c" }};

describe("posts.getPost", () => {

  it("should return statusCode 500 if null", async () => {
    postWrapperMock.get.mockReturnValue(null);
    expect(await getPost()).toEqual(expect.objectContaining({ statusCode: 500 }));
  });

  it("should return statusCode 404 if empty", async () => {
    postWrapperMock.get.mockReturnValue({});
    expect(await getPost()).toEqual(expect.objectContaining({ statusCode: 404 }));
  });

  it("should return statusCode 200 if success", async () => {
    postWrapperMock.get.mockReturnValue(POST_RESPONSE);
    expect(await getPost()).toEqual(expect.objectContaining({ statusCode: 200 }));
  });

  it("should return the correct JSON result in the body", async () => {
    postWrapperMock.get.mockReturnValue(POST_RESPONSE);
    expect(JSON.parse((await getPost()).body)).toEqual(expect.objectContaining(POST_RESPONSE));
  });

});


const createPost = require("../http-api/posts/createPost")({
  db: postWrapperMock,
});
postWrapperMock.create = jest.fn();

const CREATE_RESPONSE = { post: { username: "u", unixtime: 10, content: "c" }};
const EXPECTED_LOCATION = { "Location": "/posts/u/10" };

describe("posts.createPost", () => {

  it("should return statusCode 500 if null", async () => {
    postWrapperMock.create.mockReturnValue(null);
    expect(await createPost()).toEqual(expect.objectContaining({ statusCode: 500 }));
  });

  it("should return statusCode 201 if success", async () => {
    postWrapperMock.create.mockReturnValue(CREATE_RESPONSE);
    expect(await createPost()).toEqual(expect.objectContaining({ statusCode: 201 }));
  });

  it("should return the correct Location header", async () => {
    postWrapperMock.create.mockReturnValue(CREATE_RESPONSE);
    expect((await createPost()).headers).toEqual(expect.objectContaining(EXPECTED_LOCATION));
  });

  it("should return the correct JSON result in the body", async () => {
    postWrapperMock.create.mockReturnValue(CREATE_RESPONSE);
    expect(JSON.parse((await createPost()).body)).toEqual(expect.objectContaining(CREATE_RESPONSE));
  });

});