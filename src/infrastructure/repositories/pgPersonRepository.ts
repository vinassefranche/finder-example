import { either } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { Client } from "pg";
import { Person } from "../../domain";

const tableName = "person";

export const pgPersonRepository: Person.Repository = {
  findByIds: async (personsIds: ReadonlyArray<string>) => {
    const client = new Client();
    await client.connect();
    const result = await client.query(
      `SELECT * from ${tableName} where id IN (${personsIds
        .map((personId) => `'${personId}'`)
        .join(", ")})`
    );
    return pipe(
      result.rows,
      either.traverseArray(({ id, name, favorite_books }) =>
        Person.decoder.decode({
          id,
          name,
          favoriteBooks: favorite_books,
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
          ${tableName} (id, name, favorite_books)
        VALUES
          ${houses
            .map(
              ({ id, name, favoriteBooks }) =>
                `('${id}', '${name}', '${JSON.stringify(favoriteBooks)}')`
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
