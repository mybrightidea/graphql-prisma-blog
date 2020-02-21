import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";

const Mutation = {
  async loginUser(parent, args, context, info) {
    const { prisma } = context;
    const { data } = args;

    const user = await prisma.query.user({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error("Login failed - e");
    }
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new Error("Login failed - p");
    }
    return { user, token: generateToken(user.id) };
  },

  async createUser(parent, args, context, info) {
    const { prisma } = context;
    const { data } = args;

    const emailTaken = await prisma.exists.User({ email: data.email });

    if (emailTaken) {
      throw new Error("eMail Taken");
    }

    const password = await hashPassword(data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password
      }
    });

    return { user, token: generateToken(user.id) };
  },

  async deleteUser(parent, args, context, info) {
    const { prisma, request } = context;
    const userId = getUserId(request);

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },

  async updateUser(parent, args, context, info) {
    const { data } = args;
    const { prisma, request } = context;
    const userId = getUserId(request);

    if (typeof data.password === "string") {
      data.password = await hashPassword(data.password);
    }

    return prisma.mutation.updateUser(
      {
        data,
        where: {
          id: userId
        }
      },
      info
    );
  },

  async createPost(parent, args, context, info) {
    const { prisma, request } = context;
    const { data } = args;

    const userId = getUserId(request);

    const authorExists = await prisma.exists.User({ id: userId });

    if (!authorExists) {
      throw new Error("Invalid user <" + userId + ">");
    }
    return prisma.mutation.createPost(
      {
        data: {
          title: data.title,
          body: data.body,
          author: { connect: { id: userId } },
          published: data.published
        }
      },
      info
    );
  },

  async deletePost(parent, args, context, info) {
    const { prisma, request } = context;
    const { id } = args;
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });
    if (!postExists) {
      throw new Error("Invalid post to delete<" + id + ">");
    }
    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  async updatePost(parent, args, context, info) {
    const { id, data } = args;
    const { prisma, request } = context;
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });
    if (!postExists) {
      throw new Error("Invalid post to update <" + id + ">");
    }
    const postPublished = await prisma.exists.Post({
      id,
      published: true
    });
    if (postPublished && data.published === false) {
      prisma.mutation.deleteManyComments({
        where: {
          post: {
            id
          }
        }
      });
    }

    return prisma.mutation.updatePost(
      {
        data,
        where: {
          id
        }
      },
      info
    );
  },

  async createComment(parent, args, context, info) {
    const { prisma, request } = context;
    const { data } = args;
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: data.post,
      published: true
    });
    if (!postExists) {
      throw new Error("Invalid comment - no such post<" + data.post + ">");
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: data.text,
          author: { connect: { id: userId } },
          post: { connect: { id: data.post } }
        }
      },
      info
    );
  },

  async deleteComment(parent, args, context, info) {
    const { prisma, request } = context;
    const { id } = args;

    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id
    });

    if (!commentExists) {
      throw new Error("Comment not found");
    }

    const userCommentExists = await prisma.exists.Comment({
      id,
      author: { id: userId }
    });
    if (!userCommentExists) {
      throw new Error("Comment not owned by deleting user");
    }

    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  async updateComment(parent, args, context, info) {
    const { id, data } = args;
    const { prisma, request } = context;
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });
    if (!commentExists) {
      throw new Error("Invalid comment to update <" + id + ">");
    }
    return prisma.mutation.updateComment(
      {
        data,
        where: {
          id
        }
      },
      info
    );
  }
};

export { Mutation as default };
