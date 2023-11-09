import express from "express";
import PictureRoutes from "./pictures/PictureRoutes.js";
import {PictureRepository} from "./pictures/PictureRepository.js";
import {PictureService} from "./pictures/PictureService.js";
import mysql from 'mysql2/promise';
import CatEmployeeRepository from "./users/CatEmployeeRepository.js";
import CatEmployeeRoutes from "./users/CatEmployeeRoutes.js";
import CatEmployeeEntry from "./users/CatEmployeeEntry.js";
import BCryptEncoder from "./security/BCryptEncoder.js";
import config from "./AppConfig.js";
import {JwtTokenManagement} from "./security/JwtTokenManagement.js";

const app = express();
const port = 8888;

const pool = mysql.createPool(config.db);

const pictureRepository = new PictureRepository(pool);
const catEmployeeRepository = new CatEmployeeRepository(pool);
const jwtTokenManagement = new JwtTokenManagement(config.authentication)

PictureRoutes(
    app,
    new PictureService(pictureRepository, catEmployeeRepository),
    pictureRepository);

CatEmployeeRoutes(
    app,
    new CatEmployeeEntry(catEmployeeRepository, new BCryptEncoder(config.security.encoder)),
    jwtTokenManagement);

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});