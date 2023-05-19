import type { Room } from "./Room";

export type Repository = {
  findByHouseIds: (
    houseIds: ReadonlyArray<string>
  ) => Promise<ReadonlyArray<Room>>;
  storeAll: (rooms: ReadonlyArray<Room>) => Promise<void>;
  wipe: () => Promise<void>;
};
