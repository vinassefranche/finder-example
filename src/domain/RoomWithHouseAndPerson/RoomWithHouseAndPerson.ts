import { House } from "../House";
import { Person } from "../Person";
import { Room } from "../Room";

export type RoomWithHouseAndPerson = {
  room: Room.Room;
  house: House.House;
  person: Person.Person;
};

export type Finder = {
  getAll: () => Promise<ReadonlyArray<RoomWithHouseAndPerson>>;
};
