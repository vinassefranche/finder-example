import * as Decoder from "io-ts/Decoder";
import Chance from "chance";
import { v4 as uuidv4 } from "uuid";

export * from "./Repository";

const chance = new Chance();

export type House = {
  id: string;
  name: string;
};

export const generateRandom = ({ name }: { name?: string } = {}): House => ({
  id: uuidv4(),
  name: name ?? `House ${chance.integer({ min: 0 })}`,
});

export const decoder = Decoder.struct<House>({
  id: Decoder.string,
  name: Decoder.string,
});
