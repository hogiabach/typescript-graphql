import * as express from "express";
import { expressjwt as jwt, Request } from "express-jwt";
import { graphqlHTTP } from "express-graphql";

import schema from "./schema/schema";

const PORT = 8800;
const app = express();

app.use(
  "/protected",
  jwt({ secret: "NHY4MmkK" as string, algorithms: ["HS256"] }),
  (req: Request, res: express.Response) => {
    if (req.auth) return res.send(`Welcome, ${JSON.stringify(req.auth.id)}}`);
  }
);

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
