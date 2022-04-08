export const Post = {
    user: (parent, _, { db }) => db.users.find((user) => user.id === parent.user_id),

    comments: (parent, _, { db }) => db.comments.filter((comment) => comment.post_id === parent.id)
}