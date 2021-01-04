const { readFileSync } = require('fs');
const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDef = readFileSync('./services/salons/schema.graphql');

const typeDefs = gql`${typeDef}`;

const resolvers = {
  Query: {
    wesh() {
      return salons[0];
    }
  },
  Salon: {
    __resolveReference(object) {
      return salons.find(user => user.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const salons = [
  {
    id: "1",
    name: "L'appart de zach",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Annie la Parisienne",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];
