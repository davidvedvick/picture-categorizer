import express from "express";
import PictureRoutes from "./pictures/PictureRoutes.js";
import {PictureRepository} from "./pictures/PictureRepository.js";
import {PictureService} from "./pictures/PictureService.js";
import mysql from 'mysql2/promise';
import CatEmployeeRepository from "./users/CatEmployeeRepository.js";

const app = express();
const port = 8888;

const pool = await mysql.createPool({
    host: 'localhost',
    database: 'catpics',
    port: 3306,
    user: 'cat',
    password: 'scratch',
})

const pictureRepository = new PictureRepository(pool);
const catEmployeeRepository = new CatEmployeeRepository(pool);

PictureRoutes(app, new PictureService(pictureRepository, catEmployeeRepository), pictureRepository);

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});