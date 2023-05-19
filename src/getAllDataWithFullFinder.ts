import { getAllDataWrapper } from "./getAllDataWrapper";
import { pgHouseWithRoomsWithPersonsFinder } from "./infrastructure";

getAllDataWrapper(async () => {
  const houses = await pgHouseWithRoomsWithPersonsFinder.getAll();

  return houses.map(({ house, rooms }) => {
    return {
      name: house.name,
      rooms: rooms.map(({ room, persons }) => ({
        name: room.name,
        persons: persons.map(({ name }) => name),
      })),
    };
  });
}, "with-full-finder-result.json");
