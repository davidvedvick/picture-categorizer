import { CatEmployeeRepositoryMySql, CatEmployeeRepositorySqLite } from "./users/CatEmployeeRepository.js";
import mysql from "mysql2/promise";
import config from "./AppConfig.js";
import Database from "better-sqlite3";
import { PictureRepositoryMySql, PictureRepositorySqLite } from "./pictures/PictureRepository.js";
import { PictureTagRepositoryMySql, PictureTagRepositorySqLite } from "./pictures/tags/PictureTagRepository.js";
import migrator from "./migrator.js";

const pool = mysql.createPool(config.db);
const catEmployeesMySql = new CatEmployeeRepositoryMySql(pool);
const picturesMySql = new PictureRepositoryMySql(pool);
const pictureTagsMySql = new PictureTagRepositoryMySql(pool);

const database = new Database(config.db.file);
const catEmployeeSqLite = new CatEmployeeRepositorySqLite(database);
const picturesSqLite = new PictureRepositorySqLite(database);
const pictureTagsSqLite = new PictureTagRepositorySqLite(database);

(async () => {
    await migrator(database);

    const catEmployees = await catEmployeesMySql.getAll();
    for (const catEmployee of catEmployees) await catEmployeeSqLite.save(catEmployee);

    const pictures = await picturesMySql.findAll(null, null);
    for (const picture of pictures) await picturesSqLite.save(picture);

    const pictureTags = await pictureTagsMySql.getAll();
    for (const pictureTag of pictureTags) await pictureTagsSqLite.addTag(pictureTag.pictureId, pictureTag.tag);
})();
