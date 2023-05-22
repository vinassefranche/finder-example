import { Person, House, Room } from "./domain";

type HouseWithRoomsAndPersons = {
  house: House.House;
  rooms: ReadonlyArray<Room.Room>;
  persons: ReadonlyArray<Person.Person>;
};

const buildRandomPersonWithRoom = (
  houseId: string
): { person: Person.Person; room: Room.Room } => {
  const person = Person.generateRandom();
  return {
    person,
    room: Room.generateRandom({ houseId, personId: person.id }),
  };
};

const buildRandomHouseWithRoomsAndPersons = (): HouseWithRoomsAndPersons => {
  const house = House.generateRandom();

  const randomPersonsWithHouse = Array.from(Array(25)).map(() =>
    buildRandomPersonWithRoom(house.id)
  );

  return {
    house,
    rooms: randomPersonsWithHouse.map(({ room }) => room),
    persons: randomPersonsWithHouse.map(({ person }) => person),
  };
};

const buildKnownHouse = (): HouseWithRoomsAndPersons => {
  const house = House.generateRandom({ name: "My house" });

  const roger = Person.generateRandom({
    name: "Roger",
  });

  const josepha = Person.generateRandom({
    name: "Josepha",
  });

  const karim = Person.generateRandom({
    name: "Karim",
  });

  const ebibi = Person.generateRandom({
    name: "Ebibi",
  });

  const flowerRoom = Room.generateRandom({
    houseId: house.id,
    personId: roger.id,
    name: "Flower room",
  });
  const magicalRoom = Room.generateRandom({
    houseId: house.id,
    personId: josepha.id,
    name: "Magical room",
  });
  const fantasyRoom = Room.generateRandom({
    houseId: house.id,
    personId: karim.id,
    name: "Fantasy room",
  });
  const amazingRoom = Room.generateRandom({
    houseId: house.id,
    personId: ebibi.id,
    name: "Amazing room",
  });

  return {
    house,
    rooms: [amazingRoom, magicalRoom, fantasyRoom, flowerRoom],
    persons: [roger, josepha, karim, ebibi],
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
