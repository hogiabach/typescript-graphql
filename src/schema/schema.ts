import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import db from "../database/db";

const books = [
  { title: "My Book", id: "1", genre: "thriller", authorId: "1" },
  { title: "History of the World", id: "2", genre: "history", authorId: "1" },
  { title: "The book of stories", id: "3", genre: "fiction", authorId: "2" },
];

const authors = [
  { name: "Jack Jones", age: "50", rating: 5, id: "1" },
  { name: "Ron Tamara", age: "25", rating: 5, id: "2" },
  { name: "Ranji Iman", age: "60", rating: 5, id: "3" },
  { name: "Ivan Novic", age: "22", rating: 5, id: "4" },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {},
    },
  }),
});

const AuthorType: GraphQLObjectType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    rating: {
      type: GraphQLInt,
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books.filter((book) => parent.id == book.authorId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLString } },
      resolve(parent, { id }) {
        return db().select("*").from("books").where("id", id).first();
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLString } },
      resolve(parent, { id }) {
        return db().select("*").from("authors").where("id", id).first();
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
