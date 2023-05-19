import * as Decoder from "io-ts/Decoder";
import Chance from "chance";
import { Book } from "../Book";
import { v4 as uuidv4 } from "uuid";

export * from "./Repository";

const chance = new Chance();

export type House = {
  id: string;
  name: string;
  availableBooks: ReadonlyArray<Book.Book>;
};

export const generateRandom = ({ name }: { name?: string } = {}): House => ({
  id: uuidv4(),
  name: name ?? `House ${chance.integer({ min: 0 })}`,
  availableBooks: Array.from(Array(chance.integer({ min: 50, max: 1000 }))).map(
    Book.generateRandom
  ),
});

export const decoder = Decoder.struct<House>({
  id: Decoder.string,
  name: Decoder.string,
  availableBooks: Decoder.array(Book.decoder),
});
