import jwt from "jsonwebtoken";
import { secret, expiresIn } from "./constants";

const generateToken = id => jwt.sign({ id }, secret, { expiresIn });
export { generateToken as default };
