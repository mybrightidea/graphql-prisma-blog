import "cross-fetch/polyfill";
import bcrypt from "bcryptjs";
import prisma from "../src/prisma";
import {
  getUsers,
  createUser,
  getProfile,
  loginUser
} from "./utils/operations";

import {
  seedDatabase,
  userOne,
  userTwo,
  userThree
} from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test("Should create a new user via api", async () => {
  const variables = {
    data: {
      name: userTwo.input.name,
      email: userTwo.input.email,
      password: userTwo.input.password
    }
  };

  const response = await client.mutate({ mutation: createUser, variables });
  const { user, token } = response.data.createUser;
  const userExists = await prisma.exists.User({ id: user.id });
  expect(userExists).toBe(true);
});

test("Should not expose password when no valid bearer token", async () => {
  const response = await client.query({ query: getUsers });
  const { users } = response.data;
  const passwordExists = user => {
    return typeof user.password === "string";
  };
  const passwordsExist = users.some(passwordExists);
  expect(passwordsExist).toBe(false);
});
test("Should not expose user emails only public when no valid bearer token", async () => {
  const response = await client.query({ query: getUsers });
  const { users } = response.data;
  const emailExists = user => typeof user.email === "string";
  const emailsExist = users.some(emailExists);
  expect(emailsExist).toBe(false);
});
test("Should have saved all user fields correctly and only one user in database", async () => {
  const response = await client.query({ query: getUsers });
  const { users } = response.data;
  expect(users.length).toBe(2);
  const [user] = users;
  expect(user.name).toBe(userOne.input.name);
  expect(user.email).toBe(null);
  expect(typeof user.id).toBe("string");
  expect(user.password).toBe(null);
});
test(`Should not log in with bad email`, async () => {
  const variables = {
    data: {
      email: "asdfsdfg",
      password: userOne.input.password
    }
  };
  await expect(
    client.mutate({ mutation: loginUser, variables })
  ).rejects.toThrow();
});
test(`Should not log in with bad password good email`, async () => {
  const variables = {
    data: {
      email: userOne.input.email,
      password: "123wqwerqw45678"
    }
  };
  await expect(
    client.mutate({ mutation: loginUser, variables })
  ).rejects.toThrow();
});
test(`Should log in with good password good email`, async () => {
  const variables = {
    data: {
      email: userOne.input.email,
      password: userOne.input.password
    }
  };
  const response = await client.mutate({ mutation: loginUser, variables });
  expect(typeof response).toBe("object");
  const { user, token } = response.data.loginUser;
  expect(user.name).toBe(userOne.input.name);
  expect(user.email).toBe(null);
  expect(typeof user.id).toBe("string");
  expect(typeof token).toBe("string");
  expect(user.password).toBe(null);
});
test(`Should not signup with short password`, async () => {
  const variables = {
    data: {
      name: userThree.input.name,
      email: userThree.input.email,
      password: "bub"
    }
  };
  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});
test(`Should not signup with existing email`, async () => {
  const variables = {
    data: {
      name: userThree.input.name,
      email: userOne.input.email,
      password: userThree.input.password
    }
  };
  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});
test(`Should signup with new email good password`, async () => {
  const variables = {
    data: {
      name: userThree.input.name,
      email: userThree.input.email,
      password: userThree.input.password
    }
  };
  const response = await client.mutate({ mutation: createUser, variables });
  expect(typeof response).toBe("object");
  const { user, token } = response.data.createUser;
  expect(user.name).toBe(userThree.input.name);
  expect(user.email).toBe(null);
  expect(typeof user.id).toBe("string");
  expect(user.password).toBe(null);
  expect(typeof token).toBe("string");
});
test(`Should fetch user profile`, async () => {
  const authClient = getClient(userOne.jwt);
  const response = await authClient.query({ query: getProfile });
  expect(typeof response).toBe("object");
  const user = response.data.getProfile;
  expect(user.name).toBe(userOne.input.name);
  expect(typeof user.email).toBe("string");
  expect(user.email).toBe(userOne.input.email);
  expect(typeof user.id).toBe("string");
  expect(user.id).toBe(userOne.user.id);
  expect(typeof user.password).toBe("string");
  expect(await bcrypt.compare(userOne.input.password, user.password)).toBe(
    true
  );
});
