import prisma from "../../src/prisma";
import hashPassword from "../../src/utils/hashPassword";
import generateToken from "../../src/utils/generateToken";

let userOne = {
  input: {
    name: "Testy McTestface",
    email: "testy@test.com",
    password: "12345678"
  },
  user: undefined,
  token: undefined
};
let userTwo = {
  input: {
    name: "John Lupton",
    email: "John@test2.com",
    password: "bubble123"
  },
  user: undefined,
  token: undefined
};
let userThree = {
  input: {
    name: "Willow",
    email: "willow@test.com",
    password: "12345678"
  },
  user: undefined,
  token: undefined
};
let userFour = {
  input: {
    name: "Rosie",
    email: "rosie@test.com",
    password: "12345678"
  },
  user: undefined,
  token: undefined
};
let postOne = {
  input: {
    title: "Post 1 Published Test Post",
    body:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    published: true
  },
  post: undefined
};
let postTwo = {
  input: {
    title: "Post 2 Unpublished Test Post",
    body:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    published: false
  },
  post: undefined
};
let postThree = {
  input: {
    title: "Post 3 Newly Created",
    body:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    published: false
  },
  post: undefined
};

let commentOne = {
  input: { text: "I really liked this" },
  comment: undefined
};
let commentTwo = {
  input: { text: "Me too!!" },
  comment: undefined
};

const seedDatabase = async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  /// set up users

  const pwd = await hashPassword(userOne.input.password);

  userOne.user = await prisma.mutation.createUser({
    data: {
      ...userOne.input,
      password: pwd
    }
  });
  userOne.jwt = generateToken(userOne.user.id);
  userFour.user = await prisma.mutation.createUser({
    data: {
      ...userFour.input,
      password: pwd
    }
  });
  userFour.jwt = generateToken(userFour.user.id);

  /// set up posts
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: { connect: { id: userOne.user.id } }
    }
  });
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: { connect: { id: userOne.user.id } }
    }
  });
  //set up comments
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      text: commentOne.input.text,
      author: {
        connect: { id: userFour.user.id }
      },
      post: {
        connect: { id: postOne.post.id }
      }
    }
  });
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: { id: userOne.user.id }
      },
      post: {
        connect: { id: postOne.post.id }
      }
    }
  });
};
export {
  seedDatabase,
  userOne,
  userTwo,
  userThree,
  userFour,
  postOne,
  postTwo,
  postThree,
  commentOne,
  commentTwo
};
