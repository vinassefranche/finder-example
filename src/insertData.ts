import dotenv from "dotenv";
import {
  pgHouseRepository,
  pgPersonRepository,
  pgRoomRepository,
} from "./infrastructure";
import { buildData } from "./buildData";

dotenv.config();

const main = async () => {
  try {
    const data = buildData();
    await pgHouseRepository.wipe();
    await pgHouseRepository.storeAll(data.houses);
    console.log('store house done')
    await pgRoomRepository.wipe();
    await pgRoomRepository.storeAll(data.rooms);
    console.log('store room done')
    await pgPersonRepository.wipe();
    await pgPersonRepository.storeAll(data.persons);
    console.log('store person done')

    const house = await pgHouseRepository.getByName("My house");
    console.log(house.name);
    const rooms = await pgRoomRepository.findByHouseIds([house.id]);
    console.log(rooms.map(({ name }) => name));
    const persons = await pgPersonRepository.findByIds(
      rooms.map(({ personId }) => personId)
    );
    console.log(persons.map(({ name }) => name));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  process.exit(0);
};

main();
