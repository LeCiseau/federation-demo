const { readFileSync } = require('fs');
const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDef = readFileSync('./services/salons/schema.graphql');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();
const typeDefs = gql`${typeDef}`;

const resolvers = {
    Query: {
        firstSalon: () => salons[0],
        salon: (parent, args, context, info) =>
            salons.find(salon => salon.id === args.id),
        allSalons: async (parent, args, context, info) => {
            const tmp = await context.prisma.salon.findMany({
              include: {
                address: true,
              },
            });
            console.log(tmp);
            return tmp;
        }
    },
    Mutation: {
        createSalon: async (parent, args, context, info) => {
          console.log(args);
          return prisma.salon.create({
            data: {
              name: args.salon.name,
              email: args.salon.email,
              /*tax: args.tax && {
                connectOrCreate: { 
                    where:  { countryCode: args.countryCode },
                    create: { countryCode: args.countryCode }
                },
              }*/
              address: args.address && {
                create: {
                  address: args.address.address,
                  city: args.address.city,
                },
              },
            },
          })
        }
    },
};


const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  context: {
    prisma,
  }
});

server.listen({ port: 4005 }).then(async ({ url }) => {
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
