# graphql-prisma-blog

**GraphQL** **API** for a simple blog data structure implemented using **Postgres** database with authentication on API and on the server.
API User authentication and data cloaking is enforced using **json web tokens/JWT**

Full **CRUD** API functions for

- *User*

- *Post*

- *Comment*

## Simple data paths are:

- New User created - token issued

- Exisiting user login - token issued

- User creates Posts - status published or un published

- User creates Comments on published Posts

- Owning user amends and deletes Posts

- Owning user amends and deletes Comments

- Subscriptions exposed for Post, Comment changes

## Architecture

Using **Docker** on **Heroku** A **Prisma** server is set up to a **Postgres** SQL database. This server is protected using bearer token authorisation
A GraphQL API server (`graphql-yoga`) is built on top of Prisma services using `prisma-binding`.

The *Queries*, *Mutations*, *Subscriptions* and *custom data types* are revealed using *resolvers* making asynchronous calls to the prisma server

## Tests

*Jest* used to test all API calls and security
