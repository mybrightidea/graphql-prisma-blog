import getUserId from "../utils/getUserId";
const Subscription = {
  comment: {
    subscribe(parent, args, context, info) {
      const { prisma } = context;
      const { postId } = args;

      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId
              }
            }
          }
        },
        info
      );
    }
  },
  post: {
    subscribe(parent, args, context, info) {
      const { prisma } = context;

      return prisma.subscription.post(
        {
          where: {
            node: {
              published: true
            }
          }
        },
        info
      );
    }
  },
  myPost: {
    subscribe(parent, args, context, info) {
      const { prisma, request } = context;
      const userId = getUserId(request);
      return prisma.subscription.post(
        {
          where: {
            node: {
              author: { id: userId }
            }
          }
        },
        info
      );
    }
  }
};
export { Subscription as default };
