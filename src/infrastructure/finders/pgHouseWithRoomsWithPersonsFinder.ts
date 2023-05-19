import { either } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import * as Decoder from "io-ts/Decoder";
import { Client } from "pg";
import { House, HouseWithRoomsWithPersons, Person, Room } from "../../domain";

export const pgHouseWithRoomsWithPersonsFinder: HouseWithRoomsWithPersons.Finder =
  {
    getAll: async () => {
      const client = new Client();
      await client.connect();
      const result = await client.query(`
        with persons as (
          SELECT
            roomid,
            jsonb_agg(jsonb_build_object('id', person.id, 'name', person.name, 'favoriteBooks', person.favoritebooks, 'roomId', roomid)) persons
          FROM
            person
          group by roomid
        ), 
        rooms AS (
          SELECT
            houseid,
            jsonb_agg(jsonb_build_object('room', jsonb_build_object('id', room.id, 'name', room.name, 'houseId', houseid, 'availableBooks', room.availablebooks), 'persons', persons.persons)) rooms
          FROM
            room
          join persons on persons.roomid = room.id
          group by houseid
        )
        select house.id as house_id, house.name as house_name, house.availablebooks as house_available_books, rooms.rooms as rooms from house
        join rooms on rooms.houseid = house.id
    `);
      return pipe(
        result.rows,
        either.traverseArray(
          ({ house_id, house_name, house_available_books, rooms }) =>
            pipe(
              either.Do,
              either.apS(
                "house",
                House.decoder.decode({
                  id: house_id,
                  name: house_name,
                  availableBooks: house_available_books,
                })
              ),
              either.apS(
                "rooms",
                Decoder.array(
                  Decoder.struct({
                    room: Room.decoder,
                    persons: Decoder.array(Person.decoder),
                  })
                ).decode(rooms)
              )
            )
        ),
        either.getOrElseW((e) => {
          throw e;
        })
      );
    },
  };
