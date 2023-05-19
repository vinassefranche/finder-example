import { Person, House, Room } from "./domain";

type HouseWithRoomsAndPersons = {
  house: House.House;
  rooms: ReadonlyArray<Room.Room>;
  persons: ReadonlyArray<Person.Person>;
};

const buildRandomHouseWithRoomsAndPersons = (): HouseWithRoomsAndPersons => {
  const house = House.generateRandom();

  const room1 = Room.generateRandom({ houseId: house.id });
  const room2 = Room.generateRandom({ houseId: house.id });
  const room3 = Room.generateRandom({ houseId: house.id });
  const room4 = Room.generateRandom({ houseId: house.id });

  const person1 = Person.generateRandom({ roomId: room1.id });
  const person2 = Person.generateRandom({ roomId: room1.id });
  const person3 = Person.generateRandom({ roomId: room2.id });
  const person4 = Person.generateRandom({ roomId: room3.id });
  const person5 = Person.generateRandom({ roomId: room4.id });

  return {
    house,
    rooms: [room1, room2, room3, room4],
    persons: [person1, person2, person3, person4, person5],
  };
};

const buildKnownHouse = (): HouseWithRoomsAndPersons => {
  const house = House.generateRandom({ name: "My house" });
  const flowerRoom = Room.generateRandom({
    houseId: house.id,
    name: "Flower room",
  });
  const magicalRoom = Room.generateRandom({
    houseId: house.id,
    name: "Magical room",
  });
  const fantasyRoom = Room.generateRandom({
    houseId: house.id,
    name: "Fantasy room",
  });
  const amazingRoom = Room.generateRandom({
    houseId: house.id,
    name: "Amazing room",
  });

  const roger = Person.generateRandom({
    name: "Roger",
    roomId: amazingRoom.id,
  });
  const josephine = Person.generateRandom({
    name: "Josephine",
    roomId: amazingRoom.id,
  });

  const josepha = Person.generateRandom({
    name: "Josepha",
    roomId: magicalRoom.id,
  });

  const karim = Person.generateRandom({
    name: "Karim",
    roomId: fantasyRoom.id,
  });

  const ebibi = Person.generateRandom({
    name: "Ebibi",
    roomId: flowerRoom.id,
  });

  return {
    house,
    rooms: [amazingRoom, magicalRoom, fantasyRoom, flowerRoom],
    persons: [roger, josephine, josepha, karim, ebibi],
  };
};

const mergeHouses = (houses: ReadonlyArray<HouseWithRoomsAndPersons>) =>
  houses.reduce<{
    houses: Array<House.House>;
    rooms: Array<Room.Room>;
    persons: Array<Person.Person>;
  }>(
    (acc, house) => {
      acc.houses.push(house.house);
      acc.rooms = acc.rooms.concat(house.rooms);
      acc.persons = acc.persons.concat(house.persons);
      return acc;
    },
    { houses: [], rooms: [], persons: [] }
  );

export const buildData = (): {
  houses: ReadonlyArray<House.House>;
  rooms: ReadonlyArray<Room.Room>;
  persons: ReadonlyArray<Person.Person>;
} => {
  const randomHouses = Array.from(Array(100)).map(
    buildRandomHouseWithRoomsAndPersons
  );
  const knownHouse = buildKnownHouse();
  return mergeHouses(randomHouses.concat(knownHouse));
};
