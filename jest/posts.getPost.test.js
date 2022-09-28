'use strict'

const postWrapperMock = jest.fn();
postWrapperMock.get = jest.fn();

const getPost = require("../http-api/posts/getPost")({
  db: postWrapperMock,
});

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
    postWrapperMock.get.mockReturnValue({ test: "test"});
    expect(await getPost()).toEqual(expect.objectContaining({ statusCode: 200 }));
  });

  it("should return the JSON result in the body", async () => {
    postWrapperMock.get.mockReturnValue({ test: "test"});
    expect(JSON.parse((await getPost()).body)).toEqual(expect.objectContaining({ test: "test" }));
  });

});
