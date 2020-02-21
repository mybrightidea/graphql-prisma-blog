import jwt from "jsonwebtoken";
import { secret } from "../utils/constants";

const getUserId = (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context
    ? request.connection.context.Authorization
    : undefined;

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, secret);
    return decoded.id;
  }

  if (requireAuth) {
    throw new Error("Authorization required");
  }
  //needed to make query work
  return null;
};
export { getUserId as default };
