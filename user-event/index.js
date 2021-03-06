const { GraphQLServer, PubSub, withFilter } = require("graphql-yoga");
const { events, locations, users, participants } = require("./data.js");
const { nanoid } = require("nanoid");

const typeDefs = `
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

  type Subscription {
    # User
    userCreated: User!
    userUpdated: User!
    userDeleted: User!
    # Event
    eventCreated: Event!
    eventUpdated: Event!
    eventDeleted: Event!
    eventCount: Int!
    # Participant
    participantCreated(event_id: ID): Participant!
    participantUpdated: Participant!
    participantDeleted: Participant!
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
    createUser: (parent, { data: { username, email } }, { pubsub }) => {
      const user = { id: nanoid(), username: username, email };
      users.push(user);
      pubsub.publish("userCreated", { userCreated: user });
      return user;
    },
    updateUser: (parent, { id, data }, { pubsub }) => {
      const user_index = users.findIndex((user) => user.id === id);
      if (user_index === -1) {
        throw new Error("User not found!");
      }

      const updatedUser = (users[user_index] = {
        ...users[user_index],
        ...data,
      });
      pubsub.publish("userUpdated", { userUpdated: updatedUser });
      return updatedUser;
    },
    deleteUser: (parent, { id }, { pubsub }) => {
      const user_index = users.findIndex((user) => user.id === id);
      if (user_index === -1) {
        throw new Error("User not found!");
      }
      const deleted_user = users[user_index];
      users.splice(user_index, 1);
      pubsub.publish("userDeleted", { userDeleted: deleted_user });
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
    createEvent: (parent, { data: { title, desc } }, { pubsub }) => {
      const event = { id: nanoid(), title, desc };
      events.push(event);
      pubsub.publish("eventCreated", { eventCreated: event });
      pubsub.publish("eventCount", { eventCount: events.length });
      return event;
    },
    updateEvent: (parent, { id, data }, { pubsub }) => {
      const event_index = events.findIndex((event) => event.id === id);
      if (event_index === -1) {
        throw new Error("Event not found!");
      }

      const updatedEvent = (events[event_index] = {
        ...events[event_index],
        ...data,
      });
      pubsub.publish("eventUpdated", { eventUpdated: updatedEvent });
      return updatedEvent;
    },
    deleteEvent: (parent, { id }, { pubsub }) => {
      const event_index = events.findIndex((event) => event.id === id);
      if (event_index === -1) {
        throw new Error("Event not found!");
      }
      const deleted_event = events[event_index];
      events.splice(event_index, 1);
      pubsub.publish("eventDeleted", { eventDeleted: deleted_event });
      pubsub.publish("eventCount", { eventCount: events.length });
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
    createParticipant: (parent, { data: { user_id, event_id } }, { pubsub }) => {
      const participant = { id: nanoid(), user_id, event_id };
      participants.push(participant);
      pubsub.publish("participantCreated", { participantCreated: participant });
      return participant;
    },
    updateParticipant: (parent, { id, data }, { pubsub }) => {
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
      pubsub.publish("participantUpdated", { participantUpdated: updatedParticipant });
      return updatedParticipant;
    },
    deleteParticipant: (parent, { id }, { pubsub }) => {
      const participant_index = participants.findIndex(
        (participant) => participant.id === id
      );
      if (participant_index === -1) {
        throw new Error("Participant not found!");
      }
      const deleted_participant = participants[participant_index];
      participants.splice(participant_index, 1);
      pubsub.publish("participantDeleted", { participantDeleted: deleted_participant });
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
  Subscription: {
    // User
    userCreated: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("userCreated"),
    },
    userUpdated: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("userUpdated"),
    },
    userDeleted: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("userDeleted"),
    },
    // Event
    eventCreated: {
      subscribe: withFilter(
        (parent, args, { pubsub }) => pubsub.asyncIterator("eventCreated"),
        (payload, variables) => {
          console.log("payload =>", payload, "variables =>", variables);
          return variables.user_id
            ? payload.eventCreated.user_id === variables.user_id
            : true;
        }
      ),
    },
    eventUpdated: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("eventUpdated"),
    },
    eventDeleted: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("eventDeleted"),
    },
    eventCount: {
      subscribe: (parent, args, { pubsub }) => {
        setTimeout(() => {
          pubsub.publish("eventCount", { eventCount: events.length });
        }, 1000);

        return pubsub.asyncIterator("eventCount");
      },
    },
    // Participant
    participantCreated: {
      subscribe: withFilter(
        (parent, args, { pubsub }) =>
          pubsub.asyncIterator("participantCreated"),
        (payload, variables) => {
          console.log("payload =>", payload, "variables =>", variables);
          return variables.event_id
            ? payload.participantCreated.event_id === variables.event_id
            : true;
        }
      ),
    },
    participantUpdated: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("participantUpdated"),
    },
    participantDeleted: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("participantDeleted"),
    },
  },
};

const pubsub = new PubSub();

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(() => console.log("Server is running on localhost:4000"));
