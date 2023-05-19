import type { Person } from "./Person";

export type Repository = {
  findByRoomsIds: (
    roomId: ReadonlyArray<string>
  ) => Promise<ReadonlyArray<Person>>;
  storeAll: (persons: ReadonlyArray<Person>) => Promise<void>;
  wipe: () => Promise<void>;
};
