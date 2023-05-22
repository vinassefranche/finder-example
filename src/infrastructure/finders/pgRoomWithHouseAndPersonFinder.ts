import { either } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { Client } from "pg";
import { House, Person, Room, RoomWithHouseAndPerson } from "../../domain";

export const pgRoomWithHouseAndPersonFinder: RoomWithHouseAndPerson.Finder = {
  getAll: async () => {
    const client = new Client();
    await client.connect();
    const result = await client.query(`
      select room.id as room_id, room.name as room_name, room.available_books as room_available_books, house.id as house_id, house.name as house_name, person.id as person_id, person.name as person_name, person.favorite_books as person_favorite_books
        from room
        join house on house.id = room.house_id
        join person on person.id = room.person_id
    `);
    return pipe(
      result.rows,
      either.traverseArray(
        ({
          house_id,
          house_name,
          room_id,
          room_name,
          room_available_books,
          person_id,
          person_name,
          person_favorite_books,
        }) =>
          pipe(
            either.Do,
            either.apS(
              "house",
              House.decoder.decode({
                id: house_id,
                name: house_name,
              })
            ),
            either.apS(
              "room",
              Room.decoder.decode({
                id: room_id,
                personId: person_id,
                houseId: house_id,
                name: room_name,
                availableBooks: room_available_books,
              })
            ),
            either.apS(
              "person",
              Person.decoder.decode({
                id: person_id,
                name: person_name,
                favoriteBooks: person_favorite_books,
              })
            )
          )
      ),
      either.getOrElseW((e) => {
        throw e;
      })
    );
  },
};
