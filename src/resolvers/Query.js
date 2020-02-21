import getUserId from "../utils/getUserId";

const Query = {
  getPayload(parent, args, context, info) {
    // const { token } = args;
    // const decoded = jwt.verify(token, secret);
    // return { id: decoded.id, iat: decoded.iat };
  },
  users(parent, args, context, info) {
    const { prisma } = context;
    const { query, skip, first, after, orderBy } = args;
    const opArgs = { skip, first, after, orderBy };
    if (query) {
      opArgs.where = {
        name_contains: query
      };
    }
    return prisma.query.users(opArgs, info);
  },
  async getProfile(parent, args, context, info) {
    const { prisma, request } = context;
    const userId = getUserId(request);
    const opArgs = {};
    opArgs.where = {
      id: userId
    };
    const [user] = await prisma.query.users(opArgs, info);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
  async post(parent, args, context, info) {
    const { id } = args;
    const { prisma, request } = context;
    const userId = getUserId(request, false);
    const opArgs = {};
    opArgs.where = {
      id,
      OR: [
        {
          published: true
        },
        {
          author: { id: userId }
        }
      ]
    };
    const [post] = await prisma.query.posts(opArgs, info);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  },
  myPosts(parent, args, context, info) {
    const { prisma, request } = context;
    const userId = getUserId(request);
    const { query, skip, first, after, orderBy } = args;
    const opArgs = { skip, first, after, orderBy };

    opArgs.where = {
      author: { id: userId }
    };

    if (query) {
      opArgs.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },
  posts(parent, args, context, info) {
    const { prisma } = context;
    const { query, skip, first, after, orderBy } = args;
    const opArgs = { skip, first, after, orderBy };

    opArgs.where = {
      published: true
    };

    if (query) {
      opArgs.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, context, info) {
    const { prisma } = context;
    const { query, skip, first, after, orderBy } = args;
    const opArgs = { skip, first, after, orderBy };
    if (query) {
      opArgs.where = {
        text_contains: query
      };
    }
    return prisma.query.comments(opArgs, info);
  }
};
export { Query as default };
