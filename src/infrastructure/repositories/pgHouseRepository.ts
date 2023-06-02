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
      }),
      either.getOrElseW((e) => {
        throw e;
      })
    );
  },
  findByIds: async (houseIds: ReadonlyArray<string>) => {
    const client = new Client();
    await client.connect();
    const result = await client.query(
      `SELECT * from ${tableName} where id IN (${houseIds
        .map((houseId) => `'${houseId}'`)
        .join(", ")})`
    );
    return pipe(
      result.rows,
      either.traverseArray(({ id, name }) =>
        House.decoder.decode({
          id,
          name,
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
          ${tableName} (id, name)
        VALUES
          ${houses.map(({ id, name }) => `('${id}', '${name}')`).join(",\n")};
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
