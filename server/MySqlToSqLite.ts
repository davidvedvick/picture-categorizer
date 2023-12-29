import { CatEmployeeRepositoryMySql, CatEmployeeRepositorySqLite } from "./users/CatEmployeeRepository.js";
import mysql from "mysql2/promise";
import config from "./AppConfig.js";
import Database from "better-sqlite3";
import { PictureRepositoryMySql, PictureRepositorySqLite } from "./pictures/PictureRepository.js";
import { PictureTagRepositoryMySql, PictureTagRepositorySqLite } from "./pictures/tags/PictureTagRepository.js";
import migrator from "./migrator.js";
import CatEmployee from "./users/CatEmployee.js";
import { Picture } from "./pictures/Picture.js";

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
    const catEmployeesMap = new Map<number, CatEmployee>();
    for (const catEmployee of catEmployees) {
        catEmployeesMap.set(catEmployee.id, await catEmployeeSqLite.save(catEmployee));
    }

    const pictures = await picturesMySql.findAll(null, null);
    const picturesMap = new Map<number, Picture>();
    for (const picture of pictures) {
        const newCatEmployee = catEmployeesMap.get(picture.catEmployeeId);
        if (newCatEmployee) picture.catEmployeeId = newCatEmployee.id;

        picture.file = await picturesMySql.findFileById(picture.id);

        picturesMap.set(picture.id, await picturesSqLite.save(picture));
    }

    const pictureTags = await pictureTagsMySql.getAll();
    for (const pictureTag of pictureTags) {
        const newPicture = picturesMap.get(pictureTag.pictureId);
        if (newPicture) pictureTag.pictureId = newPicture.id;

        await pictureTagsSqLite.addTag(pictureTag.pictureId, pictureTag.tag);
    }

    process.exit();
})();
