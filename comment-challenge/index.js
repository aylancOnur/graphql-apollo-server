const {
  GraphQLServer,
  PubSub,
  withFilter,
} = require("graphql-yoga");
// const pubsub = require("./pubsub.js");
// const { ApolloServer, gql } = require("apollo-server");
const { users, posts, comments } = require("./data.js");
const { nanoid } = require("nanoid");

const typeDefs = `
  # User
  type User {
    id: ID!
    fullName: String!
    age: Int!
    posts: [Post!]!
    comments: [Comment!]!
  }

  input CreateUserInput {
    fullName: String!
    age: Int!
  }

  input UpdateUserInput {
    fullName: String
    age: Int
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

  input UpdatePostInput {
    title: String
    user_id: ID
  }

  # Comment
  type Comment {
    id: ID!
    text: String!
    post_id: ID!
    user_id: ID!
    user: User!
    post: Post!
  }

  input CreateCommentInput {
    text: String!
    post_id: ID!
    user_id: ID!
  }

  input UpdateCommentInput {
    text: String
    post_id: ID
    user_id: ID
  }

  type DeleteAllOutput {
    count: Int!
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
    # User
    createUser(data: CreateUserInput!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: DeleteAllOutput!
    # Post
    createPost(data: CreatePostInput!): Post!
    updatePost(id: ID!, data: UpdatePostInput!): Post!
    deletePost(id: ID!): Post!
    deleteAllPosts: DeleteAllOutput!

    # Comment
    createComment(data: CreateCommentInput!): Comment!
    updateComment(id: ID!, data: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
    deleteAllComments: DeleteAllOutput!
  }

  type Subscription {
    # User
    userCreated: User!
    userUpdated: User!
    userDeleted: User!
    # Post
    postCreated(user_id: ID): Post!
    postUpdated: Post!
    postDeleted: Post!
    postCount: Int!
    # Comment
    commentCreated(post_id: ID): Comment!
    commentUpdated: Comment!
    commentDeleted: Comment!
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
    // User
    createUser: (parent, { data: { fullName, age } }, { pubsub }) => {
      const user = { id: nanoid(), fullName: fullName, age };
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
      // birinci paremetre hangi indexten sonra
      // ikinci paremetre kaçtane kaldıracağımız
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

    // Post
    createPost: (parent, { data: { title, user_id } }, { pubsub }) => {
      const post = { id: nanoid(), title, user_id };
      posts.push(post);
      pubsub.publish("postCreated", { postCreated: post });
      pubsub.publish("postCount", { postCount: posts.length });
      return post;
    },
    updatePost: (parent, { id, data }, { pubsub }) => {
      const post_index = posts.findIndex((post) => post.id === id);
      if (post_index === -1) {
        throw new Error("Post not found!");
      }
      const updatedPost = (posts[post_index] = {
        ...posts[post_index],
        ...data,
      });
      pubsub.publish("postUpdated", { postUpdated: updatedPost });
      return updatedPost;
    },
    deletePost: (parent, { id }, { pubsub }) => {
      const post_index = posts.findIndex((post) => post.id === id);
      if (post_index === -1) {
        throw new Error("Post not found!");
      }
      const deleted_post = posts[post_index];
      posts.splice(post_index, 1);
      pubsub.publish("postDeleted", { postDeleted: deleted_post });
      pubsub.publish("postCount", { postCount: posts.length });
      return deleted_post;
    },
    deleteAllPosts: (parent, args, { pubsub }) => {
      const length = posts.length;
      posts.splice(0, length);
      pubsub.publish("postCount", { postCount: posts.length });
      return {
        count: length,
      };
    },
    // Comment
    createComment: (parent, { data }, { pubsub }) => {
      const comment = { id: nanoid(), ...data };
      comments.push(comment);
      pubsub.publish("commentCreated", { commentCreated: comment });
      return comment;
    },
    updateComment: (parent, { id, data }, { pubsub }) => {
      const comment_index = comments.findIndex((comment) => comment.id === id);
      if (comment_index === -1) {
        throw new Error("Comment not found!");
      }
      const updatedComment = (comments[comment_index] = {
        ...comments[comment_index],
        ...data,
      });
      pubsub.publish("commentUpdated", { commentUpdated: updatedComment });
      return updatedComment;
    },
    deleteComment: (parent, { id }, { pubsub }) => {
      const comment_index = comments.findIndex((comment) => comment.id === id);
      if (comment_index === -1) {
        throw new Error("Comment not found!");
      }
      const deleted_comment = comments[comment_index];
      comments.splice(comment_index, 1);
      pubsub.publish("commentDeleted", { commentDeleted: deleted_comment });
      return deleted_comment;
    },
    deleteAllComments: (parent, args) => {
      const length = comments.length;
      comments.splice(0, length);

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
    // Post
    postCreated: {
      subscribe: withFilter(
        (parent, args, { pubsub }) => pubsub.asyncIterator("postCreated"),
        (payload, variables) => {
          console.log("payload =>", payload, "variables =>", variables);
          return variables.user_id
            ? payload.postCreated.user_id === variables.user_id
            : true;
        }
      ),
    },
    postUpdated: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("postUpdated"),
    },
    postDeleted: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("postDeleted"),
    },
    postCount: {
      subscribe: (parent, args, { pubsub }) => {
        setTimeout(() => {
          pubsub.publish("postCount", { postCount: posts.length });
        }, 1000);

        return pubsub.asyncIterator("postCount");
      },
    },
    // Comment
    commentCreated: {
      subscribe: withFilter(
        (parent, args, { pubsub }) => pubsub.asyncIterator("commentCreated"),
        (payload, variables) => {
          console.log("payload =>", payload, "variables =>", variables);
          return variables.post_id
            ? payload.commentCreated.post_id === variables.post_id
            : true;
        }
      ),
    },
    commentUpdated: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("commentUpdated"),
    },
    commentDeleted: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("commentDeleted"),
    },
  },
};

// 1 => paremetre oluşturduğumuz type tanımları
// 2 => bu tiplere cevap dönecek olan resolverlar
// const server = new ApolloServer({ typeDefs, resolvers });
const pubsub = new PubSub();

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(() => console.log("Server is running on localhost:4000"));

// server.listen().then(({ url }) => console.log(`Apollo Server is up at ${url}`));
