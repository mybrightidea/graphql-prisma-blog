import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import { deleteComment, subscribeToComments } from "./utils/operations";

import {
  seedDatabase,
  userOne,
  userFour,
  postOne,
  commentOne
} from "./utils/seedDatabase";

import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test(`Should delete own comment`, async () => {
  const authClient = getClient(userFour.jwt);

  const variables = { id: commentOne.comment.id };
  const {
    data: { deleteComment: comment }
  } = await authClient.mutate({ mutation: deleteComment, variables });

  expect(typeof comment).toBe("object");

  const comments = await prisma.query.comments({
    where: { post: { id: postOne.post.id } }
  });
  expect(comments.length).toBe(1);
});

test(`Should not delete other users comment`, async () => {
  const authClient = getClient(userOne.jwt);
  const variables = { id: commentOne.comment.id };

  await expect(
    authClient.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow();
});
test(`Should subscribe to comments for post`, async done => {
  const variables = { postId: postOne.post.id };
  await client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe("DELETED");
      done();
    }
  });
  //change a comment
  await prisma.mutation.deleteComment({
    where: {
      id: commentOne.comment.id
    }
  });
});
