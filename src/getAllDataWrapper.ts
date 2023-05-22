import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { SimpleRoomWithHouseAndPerson } from "./domain";

dotenv.config();

export const getAllDataWrapper = async (
  getAllData: () => Promise<
    ReadonlyArray<SimpleRoomWithHouseAndPerson.SimpleRoomWithHouseAndPerson>
  >,
  fileNameToPrintTheData: string
) => {
  try {
    console.time("Time to retrieve all houses data");
    const housesData = await getAllData();
    console.timeEnd("Time to retrieve all houses data");
    fs.writeFileSync(
      path.resolve(__dirname, fileNameToPrintTheData),
      JSON.stringify(
        SimpleRoomWithHouseAndPerson.sort(housesData),
        undefined,
        2
      )
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  process.exit(0);
};
