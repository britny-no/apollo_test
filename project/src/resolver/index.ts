import prisma from "../db/context";
import { GraphQLError } from "graphql";

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

export const resolvers = {
  Query: {
    User: async (_parent, _args, _context) => {
      return await prisma.user.findMany();
    },
    Post: async (_parent, _args, _context) => {
      return await prisma.post.findMany();
    },
  },
  Mutation: {
    // 비밀번호 암호화
    createUser: async (_, { name, password, email }) => {
      // const result = await prisma.user.create({
      //   data: {
      //     name,
      //     password,
      //     email,
      //   },
      // });
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
      // return result;
    },
  },
};
