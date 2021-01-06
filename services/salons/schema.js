/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 * @typedef { import("@prisma/client").UserCreateArgs } UserCreateArgs
 */

const { gql } = require('apollo-server')

const typeDefs = gql`
extend type Query {
    salon(id: ID! ): Salon
    firstSalon: Salon
}

enum AccessType {
    METRO
    BUS
    ROAD
    PLACE
    RER
    TRAIN STATION
    PARKING
    SHOPPING MALL
    STREETCAR
}

enum SalonTypeCategory {
    INDEPENDENT
    SERIES
}

enum ExploitationType {
    OWNER
    FRANCHISE
}

enum SalonStatus {
  CREATED
  PUBLIC
  PRIVATE
  NOT_ENROLLED
  DISABLED
}

type PartnerRef @key(fields: "id") {
    id: ID!
    name: String!
}

type GeoPoint {
    lat: Float
    lng: Float
}

type Tax {
    countryCode: String
    vatNumber: String
    taxRate: Int
}

type Fees {
    commission: Int
    percentFees: Int
    statedFees: Int
}

type Access {
    type: AccessType
    name: String
}

type Address {
    address: String
    city: String
    zipCode: String
}

type SalonType {
    category: SalonTypeCategory
    name: String
    exploitation: ExploitationType
    exploitationNumber: String
}

"Salon definition"
type Salon @key(fields: "id") {
    id: ID!

    partnerRefs: [PartnerRef]
    geoLocation: GeoPoint
    tax: Tax
    fees: Fees
    access: [Access]
    address: Address
    billingAddress: Address
    type: SalonType


    status: SalonStatus

    name: String!
    logo: String
    backgrounds: [String]
    timezone: String
    carouselImages: [String]

    adwordsCampaignId: String
    adwordsSync: Boolean
    email: String
    slug: String
    description: String
    phone: String
    mobile: String
    companyName: String
    salonCode: String
    siret: String
    iban: String
    recommendation: String
    commission: Int 
    dateAcceptedGCU: String
}

input InputSalon {
    name: String!
    logo: String
    status: SalonStatus
}

type Mutation {
  createSalon(salon: InputSalon!): Salon
}
`

const resolvers = {
  Query: {
    /**
     * @param {any} parent
     * @param {any} args
     * @param {{ prisma: Prisma }} ctx
     */
    feed: (parent, args, ctx) => {
      return ctx.prisma.post.findMany({
        where: { published: true },
      })
    },
    /**
     * @param {any} parent
     * @param {{ searchString: string }} args
     * @param {{ prisma: Prisma }} ctx
     */
    filterPosts: (parent, args, ctx) => {
      return ctx.prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: args.searchString } },
            { content: { contains: args.searchString } },
          ],
        },
      })
    },
    /**
     * @param {any} parent
     * @param {{ where: { id: string }}} args
     * @param {{ prisma: Prisma }} ctx
     */
    post: (parent, args, ctx) => {
      return ctx.prisma.post.findOne({
        where: { id: Number(args.where.id) },
      })
    },
  },
  Mutation: {
    /**
     * @param {any} parent
     * @param {{ title: string, content: string, authorEmail: (string|undefined) }} args
     * @param {{ prisma: Prisma }} ctx
     */
    createDraft: (parent, args, ctx) => {
      return ctx.prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          published: false,
          author: args.authorEmail && {
            connect: { email: args.authorEmail },
          },
        },
      })
    },
    /**
     * @param {any} parent
     * @param {{ where: { id: string }}} args
     * @param {{ prisma: Prisma }} ctx
     */
    deleteOnePost: (parent, args, ctx) => {
      return ctx.prisma.post.delete({
        where: { id: Number(args.where.id) },
      })
    },
    /**
     * @param {any} parent
     * @param {{ id: string }} args
     * @param {{ prisma: Prisma }} ctx
     */
    publish: (parent, args, ctx) => {
      return ctx.prisma.post.update({
        where: { id: Number(args.id) },
        data: { published: true },
      })
    },
    /**
     * @param {any} parent
     * @param {UserCreateArgs} args
     * @param {{ prisma: Prisma }} ctx
     */
    signupUser: (parent, args, ctx) => {
      return ctx.prisma.user.create(args)
    },
  },
  User: {
    /**
     * @param {{ id: number }} parent
     * @param {any} args
     * @param {{ prisma: Prisma }} ctx
     */
    posts: (parent, args, ctx) => {
      return ctx.prisma.user
        .findOne({
          where: { id: parent.id },
        })
        .posts()
    },
  },
  Post: {
    /**
     * @param {{ id: number }} parent
     * @param {any} args
     * @param {{ prisma: Prisma }} ctx
     */
    author: (parent, args, ctx) => {
      return ctx.prisma.post
        .findOne({
          where: { id: parent.id },
        })
        .author()
    },
  },
}

module.exports = {
    resolvers,
    typeDefs,
}