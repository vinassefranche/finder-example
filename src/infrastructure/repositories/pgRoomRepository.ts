import { either } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { Client } from "pg";
import { Room } from "../../domain";

const tableName = "room";

export const pgRoomRepository: Room.Repository = {
  getAll: async () => {
    const client = new Client();
    await client.connect();
    const result = await client.query(`SELECT * from ${tableName}`);
    return pipe(
      result.rows,
      either.traverseArray(
        ({ id, name, house_id, available_books, person_id }) =>
          Room.decoder.decode({
            id,
            name,
            availableBooks: available_books,
            houseId: house_id,
            personId: person_id,
          })
      ),
      either.getOrElseW((e) => {
        throw e;
      })
    );
  },
  findByHouseIds: async (houseIds: ReadonlyArray<string>) => {
    const client = new Client();
    await client.connect();
    const result = await client.query(
      `SELECT * from ${tableName} where house_id IN (${houseIds
        .map((id) => `'${id}'`)
        .join(", ")})`
    );
    return pipe(
      result.rows,
      either.traverseArray(
        ({ id, name, house_id, available_books, person_id }) =>
          Room.decoder.decode({
            id,
            name,
            availableBooks: available_books,
            houseId: house_id,
            personId: person_id,
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
          ${tableName} (id, name, house_id, person_id, available_books)
        VALUES
          ${houses
            .map(
              ({ id, name, availableBooks, houseId, personId }) =>
                `('${id}', '${name}', '${houseId}', '${personId}', '${JSON.stringify(
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
