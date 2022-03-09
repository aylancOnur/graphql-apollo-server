const users = [
  { id: "1", fullName: "Onur Aylanc", age: 29 },
  { id: "2", fullName: "Aylanc Onur", age: 32 },
];

const posts = [
  { id: "1", title: "Onur'un gönderisi", user_id: "1" },
  { id: "2", title: "Aylanc'ın gönderisi", user_id: "2" },
  { id: "3", title: "Aylanc'ın ikinci gönderisi", user_id: "2" },
];

const comments = [
  {
    id: "1",
    text: "Onur'un yorumu",
    post_id: "1",
    user_id: "1",
  },
  {
    id: "2",
    text: "Aylanc'ın yorumu",
    post_id: "1",
    user_id: "2",
  },
  {
    id: "3",
    text: "Aylanc'ın ikinci yorumu",
    post_id: "2",
    user_id: "2",
  },
  {
    id: "4",
    text: "Onur'un ikinci yorumu",
    post_id: "3",
    user_id: "1",
  },
];

module.exports = {
  users,
  posts,
  comments,
};
