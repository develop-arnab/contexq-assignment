import { createPool, Pool } from "mysql2/promise";
export const DBClient = (): Pool => {
  return createPool({
    host: "chat-db.cscuuwkwqoq3.us-east-1.rds.amazonaws.com",
    user: "aiseadmin",
    password: "3.14ToInfinity",
    database: "chat_db",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};
