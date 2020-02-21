import { gql } from "apollo-boost";

const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      user {
        id
        name
        email
        password
      }
      token
    }
  }
`;
const getProfile = gql`
  query {
    getProfile {
      id
      name
      email
      password
    }
  }
`;
const loginUser = gql`
  mutation($data: LoginUserInput!) {
    loginUser(data: $data) {
      user {
        id
        name
        email
        password
      }
      token
    }
  }
`;
const getUsers = gql`
  query {
    users {
      id
      email
      name
      password
    }
  }
`;

const updatePost = gql`
  mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(id: $id, data: $data) {
      id
      title
      body
      published
    }
  }
`;
const createPost = gql`
  mutation($data: CreatePostInput!) {
    createPost(data: $data) {
      id
      title
      body
      published
      author {
        id
        email
      }
    }
  }
`;
const getPosts = gql`
  query {
    posts {
      id
      title
      body
      published
      author {
        id
        name
        email
        password
      }
    }
  }
`;
const myPosts = gql`
  query {
    myPosts {
      id
      title
      body
      comments {
        text
      }
      author {
        id
        name
      }
    }
  }
`;
const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
      title
      body
      published
    }
  }
`;
const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment(id: $id) {
      id
      text
      author {
        id
        name
      }
      post {
        id
        title
      }
    }
  }
`;

const subscribeToComments = gql`
  subscription($postId: ID!) {
    comment(postId: $postId) {
      mutation
      node {
        id
        text
      }
    }
  }
`;
const subscribeToPosts = gql`
  subscription {
    post {
      mutation
    }
  }
`;

export {
  getUsers,
  createUser,
  getProfile,
  loginUser,
  createPost,
  getPosts,
  updatePost,
  deletePost,
  myPosts,
  deleteComment,
  subscribeToComments,
  subscribeToPosts
};
