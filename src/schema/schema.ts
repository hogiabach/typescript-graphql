import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";
import db from "../database/db";
import generateToken from "../helpers/token";

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
      resolve(parent, args) {
        return db()
          .select("*")
          .from("authors")
          .where("id", parent.authorId)
          .first();
      },
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
      resolve(parent, args) {},
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "user",
  fields: {
    id: { type: GraphQLString },
    username: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
});

const AuthPayLoadType = new GraphQLObjectType({
  name: "AuthPayLoad",
  fields: {
    token: {
      type: GraphQLString,
    },
    message: {
      type: GraphQLString,
    },
    user: {
      type: UserType,
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    registerUser: {
      type: AuthPayLoadType,
      args: {
        username: {
          type: GraphQLString,
        },
        email: {
          type: GraphQLString,
        },
        password: {
          type: GraphQLString,
        },
      },
      async resolve(parent, { username, email, password }) {
        const id = uuidv4();
        const SALT = 10;
        await db("users").insert({
          id,
          username,
          email,
          password: await bcrypt.hash(password, SALT),
        });

        const token = generateToken(id, email);
        return {
          token,
          user: {
            id,
            username,
            email,
          },
          message: "User registered correct",
        };
      },
    },
  },
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
  mutation: Mutation,
});
