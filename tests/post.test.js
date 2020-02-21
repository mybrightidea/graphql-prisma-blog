import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  myPosts,
  subscribeToPosts
} from "./utils/operations";

import {
  seedDatabase,
  userOne,
  postOne,
  postTwo,
  postThree
} from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test(`Should only return a single published post title <${postOne.input.title}> from posts Query with author of <${userOne.input.name}>`, async () => {
  const response = await client.query({ query: getPosts });
  const { posts } = response.data;
  expect(posts.length).toBe(1);
  const [post] = posts;
  expect(post.published).toBe(true);
  expect(post.title).toBe(postOne.input.title);
  expect(post.author.name).toBe(userOne.input.name);
});
test(`Should fetch all posts for a user`, async () => {
  const authClient = getClient(userOne.jwt);

  const response = await authClient.query({ query: myPosts });
  expect(typeof response).toBe("object");
  const posts = response.data.myPosts;
  const [post1, post2] = posts;
  expect(posts.length).toBe(2);
  expect(post1.author.id).toBe(userOne.user.id);
  expect(post1.id).toBe(postOne.post.id);
  expect(post2.id).toBe(postTwo.post.id);
});
test(`Should be able to update own posts`, async () => {
  const authClient = getClient(userOne.jwt);
  const originalPubStatus = postOne.post.published;

  const newTitle = "Updated Title";

  const variables = {
    id: postOne.post.id,
    data: {
      title: newTitle,
      published: !originalPubStatus
    }
  };

  const {
    data: { updatePost: post }
  } = await authClient.mutate({ mutation: updatePost, variables });

  postOne.post = post;

  expect(typeof postOne.post).toBe("object");
  expect(postOne.post.title).toBe(newTitle);

  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: !originalPubStatus
  });
  expect(exists).toBe(true);
});
test(`Should be able to delete own posts`, async () => {
  const authClient = getClient(userOne.jwt);
  const variables = { id: postOne.post.id };
  const {
    data: { deletePost: post }
  } = await authClient.mutate({ mutation: deletePost, variables });
  postOne.post = post;

  expect(typeof postOne.post).toBe("object");
  expect(postOne.post.title).toBe(postOne.input.title);

  const exists = await prisma.exists.Post({
    id: postOne.post.id
  });
  expect(exists).toBe(false);
});
test(`Should be able to create own posts`, async () => {
  const authClient = getClient(userOne.jwt);
  const variables = {
    data: {
      title: postThree.input.title,
      body: postThree.input.body,
      published: postThree.input.published
    }
  };
  const {
    data: { createPost: post }
  } = await authClient.mutate({ mutation: createPost, variables });

  postThree.post = post;

  expect(typeof postThree.post).toBe("object");
  expect(postThree.post.title).toBe(postThree.input.title);
  expect(postThree.post.body).toBe(postThree.input.body);
  expect(postThree.post.author.id).toBe(userOne.user.id);

  const exists = await prisma.exists.Post({
    id: postThree.post.id
  });
  expect(exists).toBe(true);
});

test(`Should subscribe to post changes`, async done => {
  await client.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      expect(response.data.post.mutation).toBe("UPDATED");
      done();
    }
  });
  //change a post
  await prisma.mutation.updatePost({
    where: {
      id: postOne.post.id
    },
    data: { published: true }
  });
});

// test(`Should subscribe to post delete`, async done => {
//   await client.subscribe({ query: subscribeToPosts }).subscribe({
//     next(response) {
//       expect(response.data.post.mutation).toBe("DELETED");
//       done();
//     }
//   });
//   //change a post
//   await prisma.mutation.deletePost({
//     where: {
//       id: postOne.post.id
//     }
//   });
// });
