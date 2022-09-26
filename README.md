# Setup

## Prerequisites

- Install [Serverless Framework](https://www.serverless.com/framework/docs/getting-started)
- Create [IAM User and Access Keys](https://www.serverless.com/framework/docs/providers/aws/guide/credentials#create-an-iam-user-and-access-key)

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

Entity  Username (PK)    Timestamp (SK)    Content
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
