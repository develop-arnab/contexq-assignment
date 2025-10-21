import { DBClient } from "../utility/databaseClient";

export class DBOperation {
  constructor() {}
  async executeQuery(queryString: string, values: unknown[] = []) {
    const pool = DBClient(); 
    const [rows] = await pool.query(queryString, values);
    return rows;
  }
}
