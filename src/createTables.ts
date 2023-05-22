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
      name character varying not null,
      availableBooks jsonb
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS room (
      id uuid PRIMARY KEY,
      name character varying not null,
      houseId uuid NOT NULL,
      availableBooks jsonb
  );`);
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_room_houseid ON room(houseid);`
  );
  await client.query(`CREATE TABLE IF NOT EXISTS person (
      id uuid PRIMARY KEY,
      name character varying not null,
      roomId uuid NOT NULL,
      favoriteBooks jsonb
  );`);
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_person_roomid ON person(roomid)`
  );
  await client.end();
};

main();
