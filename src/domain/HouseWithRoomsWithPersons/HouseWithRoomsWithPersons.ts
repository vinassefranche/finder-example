import { House } from "../House";
import { Person } from "../Person";
import { Room } from "../Room";

export type HouseWithRoomsWithPersons = {
  house: House.House;
  rooms: ReadonlyArray<{
    room: Room.Room;
    persons: ReadonlyArray<Person.Person>;
  }>;
};

export type Finder = {
  getAll: () => Promise<ReadonlyArray<HouseWithRoomsWithPersons>>;
};
