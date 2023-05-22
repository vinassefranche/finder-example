import * as Decoder from "io-ts/Decoder";
import Chance from "chance";
import { Book } from "../Book";
import { v4 as uuidv4 } from "uuid";

export * from "./Repository";

const chance = new Chance();

export type Room = {
  id: string;
  name: string;
  availableBooks: ReadonlyArray<Book.Book>;
  houseId: string;
  personId: string;
};

export const generateRandom = ({
  name,
  houseId,
  personId,
}: {
  name?: string;
  houseId: string;
  personId: string;
}): Room => ({
  id: uuidv4(),
  name: name ?? `Room ${chance.integer({ min: 0 })}`,
  availableBooks: Array.from(Array(chance.integer({ min: 10, max: 100 }))).map(
    Book.generateRandom
  ),
  houseId,
  personId,
});

export const decoder = Decoder.struct<Room>({
  id: Decoder.string,
  name: Decoder.string,
  availableBooks: Decoder.array(Book.decoder),
  houseId: Decoder.string,
  personId: Decoder.string,
});
