import dotenv from "dotenv";
import fs from "fs";
import {
  pgHouseRepository,
  pgPersonRepository,
  pgRoomRepository,
} from "./infrastructure";
import path from "path";
import { SimpleHouseWithRoomsWithPersons } from "./domain";

dotenv.config();

const main = async () => {
  try {
    console.time();
    const houses = await pgHouseRepository.getAll();

    const rooms = await pgRoomRepository.findByHouseIds(
      houses.map(({ id }) => id)
    );

    const persons = await pgPersonRepository.findByRoomsIds(
      rooms.map(({ id }) => id)
    );

    const housesData = houses.map(({ name, id }) => {
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
    console.timeEnd();
    fs.writeFileSync(
      path.resolve(__dirname, "with-repositories-result.json"),
      JSON.stringify(
        SimpleHouseWithRoomsWithPersons.sort(housesData),
        undefined,
        2
      )
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  process.exit(0);
};

main();
