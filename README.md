# Social Networking Serverless Kata

This is my solution to the following Kata: [Social Networking Serverless Kata](https://github.com/claranet-ch/social-networking-serverless-kata)

![serverless-demo](https://user-images.githubusercontent.com/6751621/192869355-d0920bdb-305e-40de-a152-b92450c79fe1.gif)

## 🧪 Tech stack

- [Amazon Web Services](https://aws.amazon.com/) as the Cloud provider
- [Serverless](https://www.serverless.com/) for development and deployment
  - [serverless-dynamodb-local](https://www.serverless.com/plugins/serverless-dynamodb-local): used only for the `--migrate` and `--seed` options
  - [serverless-offline](https://www.serverless.com/plugins/serverless-offline): to emulate AWS λ and API Gateway locally
- [Docker](https://www.docker.com/) for providing the following containers:
  - `dynamodb.local` a local DynamoDB instance for dev staging
  - `dynamodb.test` a local DynamoDB instance for running integration tests
  - `dynamodb.admin` a DynamoDB GUI control panel
- [Jest](https://jestjs.io/) for running unit and integration tests
  - [jest-each](https://www.npmjs.com/package/jest-each) for reusing parametrised unit tests


## ⚙️ Setup

Install the [Serverless Framework](https://www.serverless.com/framework/docs/getting-started) and the project dependencies

    npm install -g serverless && npm install

- ### 🪛 Dev Staging environment

  The following command will start and emulate everything locally

      npm run dev

  The API Endpoints will be available at http://localhost:3000 and it will be possible to inspect the DynamoDB local database at http://localhost:8001.
  
  DynamoDB will store the data temporarly in-memory and will be populated with the same boilerplate data at each start.

- ### 🔍 Testing

- ### ☁️ Prod Cloud deployment

  Create a new [IAM User and Access Keys](https://www.serverless.com/framework/docs/providers/aws/guide/credentials#create-an-iam-user-and-access-key) and export them as enviroment variables:

      export AWS_ACCESS_KEY_ID=<your-key-here>
      export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>

  Deploy to AWS

      serverless deploy


## 📫 API Endpoints

> The endpoints that this Kata required to implement are marked with ✅, extras with 🟪

    🟪 GET     posts                       # Getting all Posts
    ✅ POST    posts/:username             # Creating a new Post      
    ✅ GET     posts/:username             # Getting an user's Timeline     
    🟪 GET     posts/:username/:timestamp  # Getting a Post     
    🟪 PUT     posts/:username/:timestamp  # Editing a Post    
    🟪 DELETE  posts/:username/:timestamp  # Deleting a Post 


- ### Creating a new Post

  - **Request:** `POST /posts/:username`
  
    The post message must be added to the request body

        { content: "Lorem ipsum..." }

  - **Response:** `500, 201` the response body will contain the created item:

        {
          "post": {
            "username": "testuser",
            "unixtime": 1667654321,
            "content": "Lorem ipsum..."
          }
        }

    The Location header will point to the created post `/posts/testuser/1667654321`

- ### Getting all Posts by one user (Timeline)

  - **Request:** `GET /posts/:username` 

  - **Response:** `500, 404, 200` the response body will contain the user posts in reverse-chronological order and the post count:

        {
          "total": 2,
          "posts": [
            {
              "username": "testuser",
              "unixtime": 1667654321,
              "content": "Lorem ipsum..."
            },
            {
              "username": "testuser",
              "unixtime": 1667654322,
              "content": "This is my second post"
            }
          ]
        }

    The **Location** header will point to the created post `/posts/testuser/1667654321`

- ### Getting a Post

  - **Request:** `GET posts/:username/:timestamp`

  - **Response:** `500, 404, 200` the response body will contain the requested post

- ### Editing a Post

  - **Request:** `PUT posts/:username/:timestamp`

  - **Response:** `500, 200` the response body will contain the modified post

    The **Location** header will point to the modified post

- ### Deleting a Post

  - **Request:** `DELETE posts/:username/:timestamp`

  - **Response:** `500, 404, 204` the response body be empty

- ### Getting all Posts

  - **Request:** `GET posts`

  - **Response:** `500, 404, 200` the response body will contain all posts and the post count
 



# Design Choices

## Data Modeling

There are some entities for which it is worth thinking about, but they are not in the scope of this kata, they will be ~~**striked out**~~.

### Entities

- ~~A **User** represents someone that has signed up to the application.~~
- A **Post** represent a user writing something on his own timeline.

### Access patterns

- ~~**Users**: It should be possible to *Create*, *Read* and *Delete* users. Users must have an unique username.~~
  
- **Posts**: It should be possible to *Create*, *Read* and *Delete* posts. A post needs an username and some text content to be created. Some sort of id will be needed to read or delete a single post.

- **Posts of User**: It should be possible to get all posts from a single user in reverse-chronological order.

### DynamoDB

This project will use DynamoDB. It is fine for the requirements of this exercise but it could be worth considering other options as the requiremests get expanded, more on this later.

```
PostsTable

Entity  username (PK)    timestamp (SK)    content
Post    <USERNAME>       <TIMESTAMP>       <MESSAGE>
```

The username and timestamp, taken together, could be enough to uniquely identify a single post (an user could be limited to one post per second). [ULID](https://github.com/ulid/spec) could be an alterative to using the timestamp as the Sort Key.

---

## Thoughts on expanding this project

As the requirements increase, some design changes should be made. A common NoSQL pattern would be to use a single table design: [DynamoDB Design Patterns for Single Table Design](https://www.serverlesslife.com/DynamoDB_Design_Patterns_for_Single_Table_Design.html)

At the moment we just have a collection of posts. If we wanted to add information about the user in a single DynamoDB table it could look something like this:

```
MainTable

Entity    Partition Key       Sort Key
User      USER#<USERNAME>     METADATA#<USERNAME>
Post      USER#<USERNAME>     POST#<USERNAME>#<TIMESTAMP>
```

Having the same Partition Key `USER#<USERNAME>` for both Users and Posts will allow to retrieve both the user's profile and posts in a **single transaction**. We would query for the Partition Key to be equal to a specific `USER#<USERNAME>`, and the Sort Key to be between `METADATA#<USERNAME>` and `POST$` (`$` comes just after `#` in ASCII).

As even more relations get implemented (friends, comments, likes, friend feeds and so on) a graph database could be more suitable for this kind of application.
