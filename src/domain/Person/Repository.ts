import type { Person } from "./Person";

export type Repository = {
  findByIds: (
    personsIds: ReadonlyArray<string>
  ) => Promise<ReadonlyArray<Person>>;
  storeAll: (persons: ReadonlyArray<Person>) => Promise<void>;
  wipe: () => Promise<void>;
};
