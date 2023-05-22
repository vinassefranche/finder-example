import { ord, readonlyArray, string } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

export type SimpleRoomWithHouseAndPerson = {
  name: string;
  houseName: string;
  personName: string;
};

export type Finder = {
  getAll: () => Promise<ReadonlyArray<SimpleRoomWithHouseAndPerson>>;
};

export const sort = (
  rooms: ReadonlyArray<SimpleRoomWithHouseAndPerson>
): ReadonlyArray<SimpleRoomWithHouseAndPerson> =>
  pipe(
    rooms,
    readonlyArray.sortBy([
      pipe(
        string.Ord,
        ord.contramap(({ name }: SimpleRoomWithHouseAndPerson) => name)
      ),
      pipe(
        string.Ord,
        ord.contramap(
          ({ houseName }: SimpleRoomWithHouseAndPerson) => houseName
        )
      ),
    ])
  );
