const users = [
  {
    id: "1",
    fullName: "Onur Aylanc",
    age: 29,
    profile_photo: "https://randomuser.me/api/portraits/men/31.jpg",
  },
  {
    id: "2",
    fullName: "Aylanc Onur",
    age: 32,
    profile_photo: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];

const posts = [
  {
    id: "1",
    title: "Onur'un gönderisi",
    description:
      "Onur'un açıklaması.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    short_description: "Onur'un açıklaması.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    user_id: "1",
    cover:
      "https://images.unsplash.com/photo-1625789452849-8d8feae8a230?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1475&q=80",
  },
  {
    id: "2",
    title: "Aylanc'ın gönderisi",
    description:
      "Aylanc'ın açıklaması.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    short_description: "Aylanc'ın açıklaması.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    user_id: "2",
    cover:
      "https://images.unsplash.com/photo-1649140236030-1c77e2f4662a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1475&q=80",
  },
  {
    id: "3",
    title: "Aylanc'ın ikinci gönderisi",
    description:
      "Aylanc'ın ikinci gönderi açıklaması.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    short_description: "Aylanc'ın ikinci gönderi açıklaması.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    user_id: "2",
    cover:
      "https://images.unsplash.com/photo-1649011555104-5f173a4e08b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1475&q=80",
  },
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

export default {
  users,
  posts,
  comments,
};
