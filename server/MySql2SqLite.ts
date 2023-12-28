import { CatEmployeeRepositoryMySql, CatEmployeeRepositorySqLite } from "./users/CatEmployeeRepository.js";
import mysql from "mysql2/promise";
import config from "./AppConfig.js";
import Database from "better-sqlite3";

const pool = mysql.createPool(config.db);
const catEmployeesMySql = new CatEmployeeRepositoryMySql(pool);

const database = new Database(config.db.file);
const catEmployeeSqLite = new CatEmployeeRepositorySqLite(database);

(async () => {
    const catEmployees = await catEmployeesMySql.getAll();
    for (const catEmployee of catEmployees) await catEmployeeSqLite.save(catEmployee);
})();
