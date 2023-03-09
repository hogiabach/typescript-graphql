import * as express from "express";
import { graphqlHTTP } from "express-graphql";
import db from "./database/db";
import schema from "./schema/schema";

const PORT = 8800;
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Now listening on localhost:${PORT}`);
});
