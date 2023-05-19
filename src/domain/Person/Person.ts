import * as Decoder from "io-ts/Decoder";
import Chance from "chance";
import { Book } from "../Book";
import { v4 as uuidv4 } from "uuid";

export * from "./Repository";

const chance = new Chance();

export type Person = {
  id: string;
  name: string;
  favoriteBooks: ReadonlyArray<Book.Book>;
  roomId: string;
};

export const generateRandom = ({
  name,
  roomId,
}: {
  name?: string;
  roomId: string;
}): Person => ({
  id: uuidv4(),
  name: name ?? chance.name(),
  favoriteBooks: Array.from(Array(chance.integer({ min: 5, max: 20 }))).map(
    Book.generateRandom
  ),
  roomId,
});

export const decoder = Decoder.struct<Person>({
  id: Decoder.string,
  name: Decoder.string,
  favoriteBooks: Decoder.array(Book.decoder),
  roomId: Decoder.string,
});
