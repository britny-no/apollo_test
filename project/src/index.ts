import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./resolver";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  // docs에 제공된 compile 환경대로 tsconfig.json 조성시, 빌드후 node 실행시 ERR_MODULE_NOT_FOUND 발생
  // module: commonjs, target: ES2021으로 변경

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
})();
