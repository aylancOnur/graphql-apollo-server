const { ApolloServer, gql } = require("apollo-server");
const { users, posts, comments } = require("./data.js");

const typeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    user_id: ID!
    user: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    post_id: ID!
    user: User!
    post: Post!
  }

  type Query {
    # User
    users: [User!]!
    user(id: ID!): User!
    # Post
    posts: [Post!]!
    post(id: ID!): Post!
    # Comment
    comments: [Comment!]!
    comment(id: ID!): Comment!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id),

    posts: () => posts,
    post: (parent, args) => posts.find((post) => post.id === args.id),

    comments: () => comments,
    comment: (parent, args) =>
      comments.find((comment) => comment.id === args.id),
  },
  User: {
    posts: (parent, args) => posts.filter((post) => post.user_id === parent.id),
    comments: (parent, args) =>
      comments.filter((comment) => comment.user_id === parent.id),
  },
  Post: {
    user: (parent, args) => users.find((user) => user.id === parent.user_id),
    comments: (parent, args) =>
      comments.filter((comment) => comment.post_id === parent.id),
  },
  Comment: {
    user: (parent, args) => users.find((user) => user.id === parent.user_id),
    post: (parent, args) => posts.find((post) => post.id === parent.post_id),
  },
};

// 1 => paremetre oluşturduğumuz type tanımları
// 2 => bu tiplere cevap dönecek olan resolverlar
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`Apollo Server is up at ${url}`));
