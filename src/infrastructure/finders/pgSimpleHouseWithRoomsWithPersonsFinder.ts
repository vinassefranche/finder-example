import { either } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import * as Decoder from "io-ts/Decoder";
import { Client } from "pg";
import { SimpleRoomWithHouseAndPerson } from "../../domain";

export const pgSimpleRoomWithHouseAndPersonFinder: SimpleRoomWithHouseAndPerson.Finder =
  {
    getAll: async () => {
      const client = new Client();
      await client.connect();
      console.time('toto')
      const result = await client.query(`
      select room.name as room_name, house.name as house_name, person.name as person_name
        from room
        join house on house.id = room.house_id
        join person on person.id = room.person_id
    `);
      return pipe(
        result.rows,
        either.traverseArray(({ room_name, house_name, person_name }) =>
          Decoder.struct({
            name: Decoder.string,
            houseName: Decoder.string,
            personName: Decoder.string,
          }).decode({
            name: room_name,
            houseName: house_name,
            personName: person_name,
          })
        ),
        either.getOrElseW((e) => {
          console.log(JSON.stringify(e));
          throw e;
        })
      );
    },
  };
