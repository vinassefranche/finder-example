import { either } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import * as Decoder from "io-ts/Decoder";
import { Client } from "pg";
import { SimpleHouseWithRoomsWithPersons } from "../../domain";

export const pgSimpleHouseWithRoomsWithPersonsFinder: SimpleHouseWithRoomsWithPersons.Finder =
  {
    getAll: async () => {
      const client = new Client();
      await client.connect();
      const result = await client.query(`
      with persons as (
        SELECT
          roomid,
          jsonb_agg(person.name) persons
        FROM
          person
        group by roomid
      ), 
      rooms AS (
        SELECT
          houseid,
          jsonb_agg(jsonb_build_object('name', room.name, 'persons', persons.persons)) rooms
        FROM
          room
        join persons on persons.roomid = room.id
        group by houseid
      )
      select house.name as name, rooms.rooms as rooms from house
      join rooms on rooms.houseid = house.id
    `);
      return pipe(
        result.rows,
        either.traverseArray(
          Decoder.struct({
            name: Decoder.string,
            rooms: Decoder.array(
              Decoder.struct({
                name: Decoder.string,
                persons: Decoder.array(Decoder.string),
              })
            ),
          }).decode
        ),
        either.getOrElseW((e) => {
          throw e;
        })
      );
    },
  };
