const { readFileSync } = require('fs');
const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDef = readFileSync('./services/salons/schema.graphql');

const typeDefs = gql`${typeDef}`;

const resolvers = {
    Query: {
        firstSalon: () => salons[0],
        salon: (parent, args, context, info) =>
            salons.find(salon => salon.id === args.id)
    },
    Mutation: {
        createSalon: async (parent, args, context, info) =>
          ({
              id: Math.round(Math.random() * 1000),
              name: args.salon.name,
          })
    },
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
    logo: "logosalon.jpg",
    username: "@ada"
  },
  {
    id: "2",
    name: "Annie la Parisienne",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];
