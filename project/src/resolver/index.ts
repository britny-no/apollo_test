import prisma from "../db/context";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";

type SearchQueryResult = {
  id: number;
  title: string;
  content: string;
  published: number;
  author_id: number;
  c_id: number;
  c_content: string;
};

export const resolvers = {
  Query: {
    User: async (_parent, _args, _context) => {
      return await prisma.user.findMany();
    },
    Post: async (_parent, _args, _context) => {
      return await prisma.post.findMany();
    },
    Search: async (_parent, _args, _context) => {
      const queryResult: SearchQueryResult[] = await prisma.$queryRaw`
        select 
          p.id, p.title, p.content, p.published, p.author_id,
          c.id as c_id, c.content as c_content
        from (SELECT * FROM POST where published = 1 and content like '%graphql%') as p left join COMMENT as c on p.id = c.post_id
      `;
      const result = {};

      queryResult.forEach((element: SearchQueryResult) => {
        const { id, title, content, published, author_id, c_id, c_content } =
          element;
        result[id] = {
          id,
          title,
          content,
          published,
          author_id,
          comments: c_id
            ? result[id]
              ? [
                  ...result[id]["comments"],
                  {
                    id: c_id,
                    content: c_content,
                  },
                ]
              : [
                  {
                    id: c_id,
                    content: c_content,
                  },
                ]
            : [],
        };
      });

      return Object.values(result);
    },
  },
  Mutation: {
    createUser: async (_, { name, password, email }) => {
      try {
        const userCheck = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        if (userCheck) {
          throw { code: "DUPLICATE_USER" };
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        const result = await prisma.user.create({
          data: {
            name,
            password: uglyPassword,
            email,
          },
        });
        return result;
      } catch (err) {
        switch (err.code) {
          case "DUPLICATE_USER":
            throw new GraphQLError("생성한 계정입니다", {
              extensions: {
                code: "400",
              },
            });
          default:
            throw new GraphQLError("관리자에게 문의바랍니다", {
              extensions: {
                code: "500",
              },
            });
        }
      }
    },
    createPost: async (
      _,
      {
        title,
        content,
        published,
        authorId,
      }: {
        title: string;
        content: string;
        authorId: number;
        published: boolean;
      }
    ) => {
      try {
        const userCheck = await prisma.user.findFirst({
          where: {
            id: authorId,
          },
        });
        if (!userCheck) {
          throw { code: "NO_USER" };
        }
        const result = await prisma.post.create({
          data: {
            title,
            content,
            published,
            authorId,
          },
        });
        return result;
      } catch (err) {
        switch (err.code) {
          case "NO_USER":
            throw new GraphQLError("존재하지 않는 유저입니다", {
              extensions: {
                code: "400",
              },
            });
          default:
            throw new GraphQLError("관리자에게 문의바랍니다", {
              extensions: {
                code: "500",
              },
            });
        }
      }
    },
    createComment: async (
      _,
      {
        content,
        postId,
      }: {
        content: string;
        postId: number;
      }
    ) => {
      try {
        const postCheck = await prisma.post.findFirst({
          where: {
            id: postId,
          },
        });
        if (!postCheck) {
          throw { code: "NO_POST" };
        }
        const result = await prisma.comment.create({
          data: {
            content,
            postId,
          },
        });
        return result;
      } catch (err) {
        switch (err.code) {
          case "NO_POST":
            throw new GraphQLError("존재하지 않는 글입니다", {
              extensions: {
                code: "400",
              },
            });
          default:
            throw new GraphQLError("관리자에게 문의바랍니다", {
              extensions: {
                code: "500",
              },
            });
        }
      }
    },
  },
};
