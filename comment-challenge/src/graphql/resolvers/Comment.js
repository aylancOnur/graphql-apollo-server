export const  Comment = {
    user: (parent, _, { db }) => db.users.find((user) => user.id === parent.user_id),

    post: (parent, _, { db }) => db.posts.find((post) => post.id === parent.post_id)
};