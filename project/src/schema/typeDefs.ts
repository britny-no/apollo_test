export const typeDefs = `
type User {
  id: Int
  email: String
  name: String
}

type Post {
  id: Int
  title: String
  content: String
  authorId: Int
  published: Boolean
  comments: [Comment]
}

type Comment {
  id: Int
  content: String
  postId: Int
}

type Query {
  User: [User],
  Post: [Post],
  Comment: [Comment],
  Search: [Post]
}

type Mutation{
  createUser(email: String!, name: String!, password: String!): User
  createPost(title: String!, content: String!, published: Boolean!, authorId: Int!): Post
  createComment(content: String!, postId: Int!): Comment
}
`;
