import type { Knex } from "knex";

interface IFKnexConfig {
  [key: string]: Knex.Config;
}

const configs: IFKnexConfig = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
    debug: true,
    useNullAsDefault: true
  },
};

export default configs;
