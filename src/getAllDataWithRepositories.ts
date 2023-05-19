import { getAllDataWrapper } from "./getAllDataWrapper";
import {
  pgHouseRepository,
  pgPersonRepository,
  pgRoomRepository,
} from "./infrastructure";

getAllDataWrapper(async () => {
  const houses = await pgHouseRepository.getAll();

  const rooms = await pgRoomRepository.findByHouseIds(
    houses.map(({ id }) => id)
  );

  const persons = await pgPersonRepository.findByRoomsIds(
    rooms.map(({ id }) => id)
  );

  return houses.map(({ name, id }) => {
    const houseRooms = rooms.filter(({ houseId }) => houseId === id);
    return {
      name,
      rooms: houseRooms.map(({ id, name }) => ({
        name,
        persons: persons
          .filter(({ roomId }) => roomId === id)
          .map(({ name }) => name),
      })),
    };
  });
}, "with-repositories-result.json");
