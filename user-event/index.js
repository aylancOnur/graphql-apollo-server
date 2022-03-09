const { ApolloServer, gql } = require("apollo-server");
const { events, locations, users, participants } = require("./data.js");

const typeDefs = gql`
  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    user_id: ID!
    user: User
    location: Location
    participants: [Participant!]!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  type Query {
    # Event
    events: [Event!]!
    event(id: ID!): Event!
    # Location
    locations: [Location!]!
    location(id: ID!): Location!
    # User
    users: [User!]!
    user(id: ID!): User!
    # Participant
    participants: [Participant!]!
    participant(id: ID!): Participant!
  }
`;

const resolvers = {
  Query: {
    events: () => events,
    event: (parent, args) => events.find((event) => event.id === args.id),
    locations: () => locations,
    location: (parent, args) =>
      locations.find((location) => location.id === args.id),
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id),
    participants: () => participants,
    participant: (parent, args) =>
      participants.find((participant) => participant.id === args.id),
  },
  User: {
    events: (parent, args) => events.filter((event) => event.user_id === parent.id),
  },
  Event: {
    user: (parent, args) => users.find((user) => user.id === parent.user_id),
    location: (parent, args) =>
      locations.find((location) => location.id === parent.location_id),
    participants: (parent, args) =>
      participants.filter((participant) => participant.event_id === parent.id),
  },
};

// 1 => paremetre oluşturduğumuz type tanımları
// 2 => bu tiplere cevap dönecek olan resolverlar
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`Apollo Server is up at ${url}`));
