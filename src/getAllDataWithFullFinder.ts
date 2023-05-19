import dotenv from "dotenv";
import fs from "fs";
import { pgHouseWithRoomsWithPersonsFinder } from "./infrastructure";
import path from "path";
import { SimpleHouseWithRoomsWithPersons } from "./domain";

dotenv.config();

const main = async () => {
  try {
    console.time();
    const houses = await pgHouseWithRoomsWithPersonsFinder.getAll();

    const housesData = houses.map(({ house, rooms }) => {
      return {
        name: house.name,
        rooms: rooms.map(({ room, persons }) => ({
          name: room.name,
          persons: persons.map(({ name }) => name),
        })),
      };
    });
    console.timeEnd();
    fs.writeFileSync(
      path.resolve(__dirname, "with-full-finder-result.json"),
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
