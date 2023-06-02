import type { House } from "./House";

export type Repository = {
  getByName: (name: string) => Promise<House>;
  findByIds: (
    personsIds: ReadonlyArray<string>
  ) => Promise<ReadonlyArray<House>>;
  storeAll: (houses: ReadonlyArray<House>) => Promise<void>;
  wipe: () => Promise<void>;
};
