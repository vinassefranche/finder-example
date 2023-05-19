import { either } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { Client } from "pg";
import { Person } from "../../domain";

const tableName = "person";

export const pgPersonRepository: Person.Repository = {
  findByRoomsIds: async (roomsIds: ReadonlyArray<string>) => {
    const client = new Client();
    await client.connect();
    const result = await client.query(
      `SELECT * from ${tableName} where roomid IN (${roomsIds
        .map((roomId) => `'${roomId}'`)
        .join(", ")})`
    );
    return pipe(
      result.rows,
      either.traverseArray(({ id, name, roomid, favoritebooks }) =>
        Person.decoder.decode({
          id,
          name,
          favoriteBooks: favoritebooks,
          roomId: roomid,
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
          ${tableName} (id, name, roomid, favoriteBooks)
        VALUES
          ${houses
            .map(
              ({ id, name, favoriteBooks, roomId }) =>
                `('${id}', '${name}', '${roomId}', '${JSON.stringify(
                  favoriteBooks
                )}')`
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
