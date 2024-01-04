export const typeDefs = `
type User {
  id: Int
  email: String
  name: String
}

type Post {
  title: String
  content: String
}

type Query {
  User: [User],
  Post: [Post]
}

type Mutation{
  createUser(email: String!, name: String!, password: String!): User
}
`;
