import { ord, readonlyArray, string } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

export type SimpleHouseWithRoomsWithPersons = {
  name: string;
  rooms: ReadonlyArray<{
    name: string;
    persons: ReadonlyArray<string>;
  }>;
};

export type Finder = {
  getAll: () => Promise<ReadonlyArray<SimpleHouseWithRoomsWithPersons>>;
};

const sortByName = <T extends { name: string }>() =>
  pipe(
    string.Ord,
    ord.contramap(({ name }: T) => name)
  );

export const sort = (
  houses: ReadonlyArray<SimpleHouseWithRoomsWithPersons>
): ReadonlyArray<SimpleHouseWithRoomsWithPersons> =>
  pipe(
    houses,
    readonlyArray.map(({ name, rooms }) => ({
      name,
      rooms: pipe(
        rooms,
        readonlyArray.map(({ name, persons }) => ({
          name,
          persons: readonlyArray.sort(string.Ord)(persons),
        })),
        readonlyArray.sort(sortByName())
      ),
    })),
    readonlyArray.sort(sortByName())
  );
