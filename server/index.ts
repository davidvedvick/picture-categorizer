import express, {json, urlencoded} from "express";
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
import fileUpload from 'express-fileupload';
import path, {dirname} from "path";
import compression from 'compression';
import {fileURLToPath} from "url";
import migrator from "./migrator.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const environmentOpts = {
    maxAge: 86400 * 1000
};

const app = express();
app.set('env', 'production');

const publicDir = path.join(__dirname, 'public');
const maxAge = environmentOpts.maxAge;

app.use(compression());
app.use('/', express.static(publicDir, { maxAge: maxAge }));

app.use(fileUpload());
app.use(json());
app.use(urlencoded({ extended: true }));

const port = 5000;

(async () => {
    await migrator(config.db);

    const pool = mysql.createPool(config.db);

    const pictureRepository = new PictureRepository(pool);
    const catEmployeeRepository = new CatEmployeeRepository(pool);
    const jwtTokenManagement = new JwtTokenManagement(config.authentication)

    PictureRoutes(
        app,
        new PictureService(pictureRepository, catEmployeeRepository),
        jwtTokenManagement);

    CatEmployeeRoutes(
        app,
        new CatEmployeeEntry(catEmployeeRepository, new BCryptEncoder(config.security.encoder)),
        jwtTokenManagement);

    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}/`);
    });
})();