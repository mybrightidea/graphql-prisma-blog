import bcrypt from "bcryptjs";

const isValid = password => {
  return !(password.length < 8);
};

const hashPassword = async password => {
  if (!isValid(password)) {
    throw new Error("password too short");
  }

  return bcrypt.hash(password, 10);
};
export { hashPassword as default };

const syncHashPassword = password => {
  if (!isValid(password)) {
    throw new Error("password too short");
  }

  return bcrypt.hashSync(password, 10);
};
export { hashPassword, syncHashPassword };
