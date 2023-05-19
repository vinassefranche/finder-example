import dotenv from "dotenv";
import fs from "fs";
import { pgSimpleHouseWithRoomsWithPersonsFinder } from "./infrastructure";
import path from "path";
import { SimpleHouseWithRoomsWithPersons } from "./domain";

dotenv.config();

const main = async () => {
  try {
    console.time();
    const houses = await pgSimpleHouseWithRoomsWithPersonsFinder.getAll();
    console.timeEnd();
    fs.writeFileSync(
      path.resolve(__dirname, "with-simple-finder-result.json"),
      JSON.stringify(SimpleHouseWithRoomsWithPersons.sort(houses), undefined, 2)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  process.exit(0);
};

main();
