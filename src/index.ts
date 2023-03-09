import * as express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema";

const PORT = 5000;
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Now listening on http:\\\\localhost:${PORT}`);
});
