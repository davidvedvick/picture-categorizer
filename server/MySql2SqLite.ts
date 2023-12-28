import { CatEmployeeRepositoryMySql, CatEmployeeRepositorySqLite } from "./users/CatEmployeeRepository.js";
import mysql from "mysql2/promise";
import config from "./AppConfig.js";
import Database from "better-sqlite3";
import { PictureRepositoryMySql, PictureRepositorySqLite } from "./pictures/PictureRepository.js";

const pool = mysql.createPool(config.db);
const catEmployeesMySql = new CatEmployeeRepositoryMySql(pool);
const picturesMySql = new PictureRepositoryMySql(pool);

const database = new Database(config.db.file);
const catEmployeeSqLite = new CatEmployeeRepositorySqLite(database);
const picturesSqLite = new PictureRepositorySqLite(database);

(async () => {
    const catEmployees = await catEmployeesMySql.getAll();
    for (const catEmployee of catEmployees) await catEmployeeSqLite.save(catEmployee);

    const pictures = await picturesMySql.findAll(null, null);
    for (const picture of pictures) await picturesSqLite.save(picture);
})();
