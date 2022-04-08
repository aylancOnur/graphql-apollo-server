import { withFilter } from 'graphql-yoga';

export const Subscription = {
    // User
    userCreated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('userCreated'),
    },
    userUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('userUpdated'),
    },
    userDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('userDeleted'),
    },
    userCount: {
        subscribe: (_, __, { pubsub, db }) => {
            setTimeout(() => {
                pubsub.publish('userCount', { userCount: db.users.length })
            });
            
            return pubsub.asyncIterator('userCount')
        },
    },

    // Post
    postCreated: {
        subscribe: withFilter(
            (_, __, { pubsub }) => pubsub.asyncIterator('postCreated'),
            (payload, variables) => {

                return variables.user_id ? (payload.postCreated.user_id === variables.user_id) : true ;
            }
        ),
    },
    postUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('postUpdated'),
    },
    postDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('postDeleted'),
    },
    postCount: {
        subscribe: (_, __, { pubsub, db }) => { 
            setTimeout(() => {
                pubsub.publish('postCount', { postCount: db.posts.length })
            });

            return pubsub.asyncIterator('postCount') 
        },
    },

    // Post
    commentCreated: {
        subscribe: withFilter(
            (_, __, { pubsub }) => pubsub.asyncIterator('commentCreated'),

            (payload, variables) => {
                return variables.post_id ? payload.commentCreated.post_id === variables.post_id : true;
            }
        ),
    },
    commentUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('commentUpdated'),
    },
    commentDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('commentDeleted'),
    },
    commentCount: {
        subscribe: (_, __, { pubsub, db }) => { 
            setTimeout(() => {
                pubsub.publish('commentCount', { commentCount: db.comments.length })
            });
            
            return pubsub.asyncIterator('commentCount');
        }
    },
}