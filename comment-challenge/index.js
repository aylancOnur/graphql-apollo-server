const { ApolloServer, gql } = require("apollo-server");
const { users, posts, comments } = require("./data.js");
const { nanoid } = require("nanoid");

const typeDefs = gql`
  # User
  type User {
    id: ID!
    fullName: String!
    posts: [Post!]!
    comments: [Comment!]!
  }

  input CreateUserInput {
    fullName: String!
  }
  # Post
  type Post {
    id: ID!
    title: String!
    user_id: ID!
    user: User!
    comments: [Comment!]!
  }

  input CreatePostInput {
    title: String!
    user_id: ID!
  }

  # Comment
  type Comment {
    id: ID!
    text: String!
    post_id: ID!
    user: User!
    post: Post!
  }

  input CreateCommentInput {
    text: String!
    post_id: ID!
    user_id: ID!
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

  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
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
  Mutation: {
    createUser: (parent, { data: { fullName } }) => {
      const user = { id: nanoid(), fullName: fullName };
      users.push(user);
      return user;
    },
    createPost: (parent, { data: { title, user_id } }) => {
      const post = { id: nanoid(), title, user_id };
      posts.push(post);
      return post;
    },
    createComment: (parent, { data }) => {
      const comment = { id: nanoid(), ...data };
      comments.push(comment);
      return comment;
    },
  },
};

// 1 => paremetre oluşturduğumuz type tanımları
// 2 => bu tiplere cevap dönecek olan resolverlar
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`Apollo Server is up at ${url}`));
