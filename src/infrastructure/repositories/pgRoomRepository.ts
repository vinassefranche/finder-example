import { either } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { Client } from "pg";
import { Room } from "../../domain";

const tableName = "room";

export const pgRoomRepository: Room.Repository = {
  findByHouseIds: async (houseIds: ReadonlyArray<string>) => {
    const client = new Client();
    await client.connect();
    const result = await client.query(
      `SELECT * from ${tableName} where houseid IN (${houseIds
        .map((id) => `'${id}'`)
        .join(", ")})`
    );
    return pipe(
      result.rows,
      either.traverseArray(({ id, name, houseid, availablebooks }) =>
        Room.decoder.decode({
          id,
          name,
          availableBooks: availablebooks,
          houseId: houseid,
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
          ${tableName} (id, name, houseid, availableBooks)
        VALUES
          ${houses
            .map(
              ({ id, name, availableBooks, houseId }) =>
                `('${id}', '${name}', '${houseId}', '${JSON.stringify(
                  availableBooks
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
