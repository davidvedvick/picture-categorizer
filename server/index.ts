import express from "express";
import PictureRoutes from "./pictures/PictureRoutes.js";
import {PictureRepository} from "./pictures/PictureRepository.js";
import {PictureService} from "./pictures/PictureService.js";
import mysql from 'mysql2/promise';

const app = express();
const port = 5000;

const pool = await mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'cat',
    password: 'scratch',
})

const pictureRepository = new PictureRepository(pool);

PictureRoutes(app, new PictureService(pictureRepository), pictureRepository);

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});