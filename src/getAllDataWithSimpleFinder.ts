import { getAllDataWrapper } from "./getAllDataWrapper";
import { pgSimpleRoomWithHouseAndPersonFinder } from "./infrastructure";

getAllDataWrapper(
  pgSimpleRoomWithHouseAndPersonFinder.getAll,
  "with-simple-finder-result.json"
);
