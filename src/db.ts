import sqlite3 from "sqlite3";

class Database {
  private db: sqlite3.Database;
  constructor(path: string) {
    this.db = new sqlite3.Database(path, (err) => {
      if (err) {
        console.log("😭 Could not connect to database", err);
      } else {
        console.log("😎 Connected to database");
      }
    });
  }

  run(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log("Error running sql " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  get(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log("Error running sql: " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  all(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log("Error running sql: " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

class PartsTable {
  private database: Database;
  constructor(db: Database) {
    this.database = db;
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS parts (
      category TEXT,
      subcategory TEXT,
      part TEXT,
      description TEXT,
      material TEXT,
      weight TEXT
    )`;
    return this.database.run(sql);
  }

  insert(
    category: string,
    subcategory: string,
    part: string,
    description: string,
    material: string,
    weight: string
  ) {
    return this.database.run(
      "INSERT INTO parts (category, subcategory, part, description, material, weight) VALUES (?, ?, ?, ?, ?, ?)",
      [category, subcategory, part, description, material, weight]
    );
  }

  update(
    category: string,
    subcategory: string,
    part: string,
    description: string,
    material: string,
    weight: string
  ) {
    return this.database.run(
      `UPDATE parts SET description = ?, material = ?, weight = ? WHERE category = ? AND subcategory = ? AND part = ?`,
      [description, material, weight, category, subcategory, part]
    );
  }

  getAll() {
    return this.database.all(
      `SELECT * FROM parts ORDER BY category, subcategory, part`
    );
  }

  delete(part: string) {
    return this.database.run(`DELETE FROM parts WHERE part = ?`, [part]);
  }

  clearTable() {
    return this.database.run(`DELETE FROM parts`, []);
  }
}

const db = new Database("metals.db");
const partsTable = new PartsTable(db);

export { partsTable };
