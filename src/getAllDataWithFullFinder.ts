import { getAllDataWrapper } from "./getAllDataWrapper";
import { pgRoomWithHouseAndPersonFinder } from "./infrastructure";

getAllDataWrapper(async () => {
  const rooms = await pgRoomWithHouseAndPersonFinder.getAll();

  return rooms.map(({ house, person, room }) => ({
    name: room.name,
    houseName: house.name,
    personName: person.name,
  }));
}, "with-full-finder-result.json");
