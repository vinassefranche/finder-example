import * as Decoder from "io-ts/Decoder";
import Chance from "chance";

export type Book = {
  name: string;
  author: string;
  year: number;
  summary: string;
};

const authors = [
  "Terry Pratchett",
  "David and Leigh Eddings",
  "Michael Moorcock",
  "Glen Cook",
  "Frank Herber",
  "Philip K. Dick",
];

const chance = new Chance();

export const generateRandom = (): Book => ({
  author: chance.pickone(authors),
  name: chance.sentence(),
  summary: [chance.paragraph(), chance.paragraph(), chance.paragraph()].join(
    "\n"
  ),
  year: parseInt(chance.year({ min: 1900, max: 2022 })),
});

export const decoder = Decoder.struct<Book>({
  author: Decoder.string,
  name: Decoder.string,
  summary: Decoder.string,
  year: Decoder.number,
});
