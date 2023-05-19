import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const client = new Client();
const main = async () => {
  await client.connect();

  await client.query(`CREATE TABLE IF NOT EXISTS house (
      id uuid NOT NULL,
      name character varying not null,
      availableBooks jsonb
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS room (
      id uuid NOT NULL,
      name character varying not null,
      houseId uuid NOT NULL,
      availableBooks jsonb
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS person (
      id uuid NOT NULL,
      name character varying not null,
      roomId uuid NOT NULL,
      favoriteBooks jsonb
  );`);
  await client.end();
};

main();
