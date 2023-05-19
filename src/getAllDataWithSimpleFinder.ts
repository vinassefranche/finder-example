import { getAllDataWrapper } from "./getAllDataWrapper";
import { pgSimpleHouseWithRoomsWithPersonsFinder } from "./infrastructure";

getAllDataWrapper(
  pgSimpleHouseWithRoomsWithPersonsFinder.getAll,
  "with-simple-finder-result.json"
);
