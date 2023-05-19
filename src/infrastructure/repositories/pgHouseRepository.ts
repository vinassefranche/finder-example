import { Client } from "pg";
import { House } from "../../domain";
import { pipe } from "fp-ts/lib/function";
import { either } from "fp-ts";

const tableName = "house";

export const pgHouseRepository: House.Repository = {
  getByName: async (name: string) => {
    const client = new Client();
    await client.connect();
    const result = await client.query(
      `SELECT * from ${tableName} where name = '${name}'`
    );
    if (!result.rows[0]) {
      throw new Error("not house found with given name");
    }
    return pipe(
      House.decoder.decode({
        id: result.rows[0].id,
        name: result.rows[0].name,
        availableBooks: result.rows[0].availablebooks,
      }),
      either.getOrElseW((e) => {
        throw e;
      })
    );
  },
  getAll: async () => {
    const client = new Client();
    await client.connect();
    const result = await client.query(`SELECT * from ${tableName}`);
    return pipe(
      result.rows,
      either.traverseArray(({ id, name, availablebooks }) =>
        House.decoder.decode({
          id,
          name,
          availableBooks: availablebooks,
        })
      ),
      either.getOrElseW((e) => {
        throw e;
      })
    );
  },
  storeAll: async (houses) => {
    const client = new Client();
    await client.connect();
    await client.query(`
        INSERT INTO 
          ${tableName} (id, name, availableBooks)
        VALUES
          ${houses
            .map(
              ({ id, name, availableBooks }) =>
                `('${id}', '${name}', '${JSON.stringify(availableBooks)}')`
            )
            .join(",\n")};
      `);
    return;
  },
  wipe: async () => {
    const client = new Client();
    await client.connect();
    await client.query(`TRUNCATE ${tableName}`);
    return;
  },
};
