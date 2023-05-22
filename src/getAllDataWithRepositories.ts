import { getAllDataWrapper } from "./getAllDataWrapper";
import {
  pgHouseRepository,
  pgPersonRepository,
  pgRoomRepository,
} from "./infrastructure";

getAllDataWrapper(async () => {
  const rooms = await pgRoomRepository.getAll();

  const [houses, persons] = await Promise.all([
    pgHouseRepository.findByIds(rooms.map(({ houseId }) => houseId)),
    await pgPersonRepository.findByIds(rooms.map(({ personId }) => personId)),
  ]);

  return rooms.map(({ name, houseId, personId }) => {
    const personName = persons.find(({ id }) => personId === id)?.name;
    if (!personName) {
      throw new Error(`missing person ${personId} for room ${name}`);
    }
    const houseName = houses.find(({ id }) => houseId === id)?.name;
    if (!houseName) {
      throw new Error(`missing house ${houseId} for room ${name}`);
    }
    return {
      name,
      houseName,
      personName,
    };
  });
}, "with-repositories-result.json");
