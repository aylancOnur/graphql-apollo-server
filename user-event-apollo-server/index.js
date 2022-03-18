const { ApolloServer, gql } = require("apollo-server");
const { events, locations, users, participants } = require("./data.js");
const { nanoid } = require("nanoid");

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

  input CreateEventInput {
    title: String!
    desc: String!
  }

  input UpdateEventInput {
    title: String
    desc: String
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
  }

  input CreateLocationInput {
    name: String!
    desc: String!
  }

  input UpdateLocationInput {
    name: String
    desc: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
  }

  input CreateUserInput {
    username: String!
    email: String!
  }

  input UpdateUserInput {
    username: String
    email: String
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  input CreateParticipantInput {
    user_id: String!
    event_id: String!
  }

  input UpdateParticipantInput {
    user_id: String!
    event_id: String!
  }

  type DeleteAllOutput {
    count: Int!
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

  type Mutation {
    # User
    createUser(data: CreateUserInput!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: DeleteAllOutput!
    # Event
    createEvent(data: CreateEventInput!): Event!
    updateEvent(id: ID!, data: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Event!
    deleteAllEvents: DeleteAllOutput!
    # Location
    createLocation(data: CreateLocationInput!): Location!
    updateLocation(id: ID!, data: UpdateLocationInput!): Location!
    deleteLocation(id: ID!): Location!
    deleteAllLocations: DeleteAllOutput!
    # Participant
    createParticipant(data: CreateParticipantInput!): Participant!
    updateParticipant(id: ID!, data: UpdateParticipantInput!): Participant!
    deleteParticipant(id: ID!): Participant!
    deleteAllParticipants: DeleteAllOutput!
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
    events: (parent, args) =>
      events.filter((event) => event.user_id === parent.id),
  },
  Event: {
    user: (parent, args) => users.find((user) => user.id === parent.user_id),
    location: (parent, args) =>
      locations.find((location) => location.id === parent.location_id),
    participants: (parent, args) =>
      participants.filter((participant) => participant.event_id === parent.id),
  },
  Mutation: {
    // User
    createUser: (parent, { data: { username, email } }) => {
      const user = { id: nanoid(), username: username, email };
      users.push(user);
      return user;
    },
    updateUser: (parent, { id, data }) => {
      const user_index = users.findIndex((user) => user.id === id);
      if (user_index === -1) {
        throw new Error("User not found!");
      }

      const updatedUser = (users[user_index] = {
        ...users[user_index],
        ...data,
      });
      return updatedUser;
    },
    deleteUser: (parent, { id }) => {
      const user_index = users.findIndex((user) => user.id === id);
      if (user_index === -1) {
        throw new Error("User not found!");
      }
      const deleted_user = users[user_index];
      users.splice(user_index, 1);
      return deleted_user;
    },
    deleteAllUsers: (parent, args) => {
      const length = users.length;
      users.splice(0, length);

      return {
        count: length,
      };
    },
    // Event
    createEvent: (parent, { data: { title, desc } }) => {
      const event = { id: nanoid(), title, desc };
      events.push(event);
      return event;
    },
    updateEvent: (parent, { id, data }) => {
      const event_index = events.findIndex((event) => event.id === id);
      if (event_index === -1) {
        throw new Error("Event not found!");
      }

      const updatedEvent = (events[event_index] = {
        ...events[event_index],
        ...data,
      });
      return updatedEvent;
    },
    deleteEvent: (parent, { id }) => {
      const event_index = events.findIndex((event) => event.id === id);
      if (event_index === -1) {
        throw new Error("Event not found!");
      }
      const deleted_event = events[event_index];
      events.splice(event_index, 1);
      return deleted_event;
    },
    deleteAllEvents: (parent, args) => {
      const length = events.length;
      events.splice(0, length);

      return {
        count: length,
      };
    },
    // Location
    createLocation: (parent, { data: { name, desc } }) => {
      const location = { id: nanoid(), name, desc };
      locations.push(location);
      return location;
    },
    updateLocation: (parent, { id, data }) => {
      const location_index = locations.findIndex(
        (location) => location.id === id
      );
      if (location_index === -1) {
        throw new Error("Location not found!");
      }

      const updatedLocation = (locations[location_index] = {
        ...locations[location_index],
        ...data,
      });
      return updatedLocation;
    },
    deleteLocation: (parent, { id }) => {
      const location_index = locations.findIndex(
        (location) => location.id === id
      );
      if (location_index === -1) {
        throw new Error("Location not found!");
      }
      const deleted_location = locations[location_index];
      locations.splice(location_index, 1);
      return deleted_location;
    },
    deleteAllLocations: (parent, args) => {
      const length = locations.length;
      locations.splice(0, length);

      return {
        count: length,
      };
    },
    // Participant
    createParticipant: (parent, { data: { user_id, event_id } }) => {
      const participant = { id: nanoid(), user_id, event_id };
      participants.push(participant);
      return participant;
    },
    updateParticipant: (parent, { id, data }) => {
      const participant_index = participants.findIndex(
        (participant) => participant.id === id
      );
      if (participant_index === -1) {
        throw new Error("Participant not found!");
      }

      const updatedParticipant = (participants[participant_index] = {
        ...participants[participant_index],
        ...data,
      });
      return updatedParticipant;
    },
    deleteParticipant: (parent, { id }) => {
      const participant_index = participants.findIndex(
        (participant) => participant.id === id
      );
      if (participant_index === -1) {
        throw new Error("Participant not found!");
      }
      const deleted_participant = participants[participant_index];
      participants.splice(participant_index, 1);
      return deleted_participant;
    },
    deleteAllParticipants: (parent, args) => {
      const length = participants.length;
      participants.splice(0, length);

      return {
        count: length,
      };
    },
  },
};

// 1 => paremetre oluşturduğumuz type tanımları
// 2 => bu tiplere cevap dönecek olan resolverlar
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`Apollo Server is up at ${url}`));
