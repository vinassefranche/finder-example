import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const client = new Client();
const main = async () => {
  await client.connect();

  await client.query(`DROP TABLE IF EXISTS house;`);
  await client.query(`DROP TABLE IF EXISTS room;`);
  await client.query(`DROP TABLE IF EXISTS person;`);

  await client.query(`CREATE TABLE IF NOT EXISTS house (
      id uuid PRIMARY KEY,
      name character varying not null
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS room (
      id uuid PRIMARY KEY,
      name character varying not null,
      house_id uuid NOT NULL,
      person_id uuid NOT NULL,
      available_books jsonb
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS person (
      id uuid PRIMARY KEY,
      name character varying not null,
      favorite_books jsonb
  );`);
  await client.end();
};

main();
