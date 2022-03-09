const { ApolloServer, gql } = require("apollo-server");
const { authors, books } = require("./data.js");

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    age: Int
    books(filter: String): [Book!]
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    author_id: String!
    score: Float
    isPublished: Boolean
  }

  type Query {
    books: [Book!]
    book(id: ID!): Book
    authors: [Author!]
    author(id: ID!): Author
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    book: (parent, args) => books.find((book) => book.id === args.id),
    authors: () => authors,
    author: (parent, args) => authors.find((author) => author.id === args.id),
  },
  Book: {
    author: (parent, args) =>
      authors.find((author) => author.id === parent.author_id),
  },
  Author: {
    books: (parent, args) => {
      let filtered = books.filter((book) => book.author_id === parent.id);
      if (args.filter) {
        filtered = filtered.filter((book) =>
          book.title.toLowerCase().startsWith(args.filter.toLowerCase())
        );
      }
      return filtered;
    },
  },
};

// 1 => paremetre oluşturduğumuz type tanımları
// 2 => bu tiplere cevap dönecek olan resolverlar
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`Apollo Server is up at ${url}`));
