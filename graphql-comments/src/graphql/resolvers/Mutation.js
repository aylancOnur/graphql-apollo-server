import { nanoid } from "nanoid";

export const Mutation = {
  // User
  createUser: (parent, { data }, { pubsub, db }) => {
    const user = {
      id: nanoid(),
      // fullName: args.data.fullName
      ...data,
    };

    db.users.push(user);
    pubsub.publish("userCreated", { userCreated: user });

    return user;
  },
  updateUser: (parent, { id, data }, { pubsub, db }) => {
    const user_index = db.users.findIndex((user) => user.id === id);

    if (user_index === -1) {
      throw new Error("User not found");
    }

    const updated_user = (db.users[user_index] = {
      ...db.users[user_index],
      ...data,
    });

    pubsub.publish("userUpdated", { userUpdated: updated_user });

    return updated_user;
  },
  deleteUser: (parent, { id }, { pubsub, db }) => {
    const user_index = db.users.findIndex((user) => user.id === id);

    if (user_index === -1) {
      throw new Error("User not found");
    }

    const deleted_user = db.users[user_index];

    db.users.splice(user_index, 1);

    pubsub.publish("userDeleted", { userDeleted: deleted_user });
    pubsub.publish("userCount", { userCount: users.length });

    return deleted_user;
  },
  deleteAllUsers: (_, __, { pubsub, db }) => {
    const length = db.users.length;
    db.users.splice(0, length);

    pubsub.publish("userCount", { userCount: users.length });

    return {
      count: length,
    };
  },

  // Post
  createPost: (parent, { data }, { pubsub, db }) => {
    const post = {
      id: nanoid(),
      ...data,
    };

    db.posts.push(post);
    pubsub.publish("postCreated", { postCreated: post });
    pubsub.publish("postCount", { postCount: db.posts.length });

    return post;
  },
  updatePost: (parent, { id, data }, { pubsub, db }) => {
    const post_index = db.posts.findIndex((post) => post.id === id);

    if (post_index === -1) {
      throw new Error("Post not found");
    }

    const updated_post = (db.posts[post_index] = {
      ...db.posts[post_index],
      ...data,
    });

    pubsub.publish("postUpdated", { postUpdated: updated_post });

    return updated_post;
  },
  deletePost: (parent, { id }, { pubsub, db }) => {
    const post_index = db.posts.findIndex((post) => post.id === id);

    if (post_index === -1) {
      throw new Error("Post not found");
    }

    const deleted_post = db.posts[post_index];

    db.posts.splice(post_index, 1);

    pubsub.publish("postDeleted", { postDeleted: deleted_post });
    pubsub.publish("postCount", { postCount: posts.length });

    return deleted_post;
  },
  deleteAllPosts: (_, __, { pubsub, db }) => {
    const length = db.posts.length;
    db.posts.splice(0, length);

    pubsub.publish("postCount", { postCount: db.posts.length });

    return {
      count: length,
    };
  },

  // Comment
  createComment: (parent, { data }, { pubsub, db }) => {
    const comment = {
      id: nanoid(),
      ...data,
    };

    db.comments.push(comment);
    pubsub.publish("commentCreated", { commentCreated: comment });
    pubsub.publish("commentCount", { commentCount: comments.length });

    return comment;
  },
  updateComment: (parent, { id, data }, { pubsub, db }) => {
    const comment_index = db.comments.findIndex((comment) => comment.id === id);

    if (comment_index === -1) {
      throw new Error("Comment not found");
    }

    const updated_comment = (db.comments[comment_index] = {
      ...db.comments[comment_index],
      ...data,
    });

    pubsub.publish("commentUpdated", { commentUpdated: updated_comment });

    return updated_comment;
  },
  deleteComment: (parent, { id }, { pubsub, db }) => {
    const comment_index = db.comments.findIndex((comment) => comment.id === id);

    if (comment_index === -1) {
      throw new Error("Comment not found");
    }

    const deleted_comment = db.comments[comment_index];

    db.comments.splice(comment_index, 1);
    pubsub.publish("commentDeleted", { commentDeleted: deleted_comment });
    pubsub.publish("commentCount", { commentCount: db.comments.length });

    return deleted_comment;
  },
  deleteAllComments: (_, __, { pubsub, db }) => {
    const length = db.comments.length;
    db.comments.splice(0, length);

    pubsub.publish("commentCount", { commentCount: comments.length });

    return {
      count: length,
    };
  },
};
