import express, { json, urlencoded } from "express";
import PictureRoutes from "./pictures/PictureRoutes.js";
import { PictureRepositoryMySql } from "./pictures/PictureRepository.js";
import { PictureService } from "./pictures/PictureService.js";
import mysql from "mysql2/promise";
import { CatEmployeeRepositoryMySql } from "./users/CatEmployeeRepository.js";
import CatEmployeeRoutes from "./users/CatEmployeeRoutes.js";
import CatEmployeeEntry from "./users/CatEmployeeEntry.js";
import BCryptEncoder from "./security/BCryptEncoder.js";
import config from "./AppConfig.js";
import { JwtTokenManagement } from "./security/JwtTokenManagement.js";
import fileUpload from "express-fileupload";
import path, { dirname } from "path";
import compression from "compression";
import { fileURLToPath } from "url";
import migrator from "./migrator.js";
import { ResizingPictureFileService } from "./pictures/ResizingPictureFileService.js";
import { CachingResizedPictureFileService } from "./pictures/CachingPictureFileService.js";
import PictureTagRoutes from "./pictures/tags/PictureTagRoutes.js";
import { PictureTagService } from "./pictures/tags/PictureTagService.js";
import { PictureTagRepositoryMySql } from "./pictures/tags/PictureTagRepository.js";
import { TagService } from "./pictures/tags/TagService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const environmentOpts = {
    maxAge: 86400 * 1000,
};

const app = express();
app.set("env", "production");

const publicDir = path.join(__dirname, "public");
const maxAge = environmentOpts.maxAge;

app.use(compression());
app.use("/", express.static(publicDir, { maxAge: maxAge }));

app.use(fileUpload());
app.use(json());
app.use(urlencoded({ extended: true }));

const port = 5000;

(async () => {
    await migrator(config.db);

    const pool = mysql.createPool(config.db);

    const pictureRepository = new PictureRepositoryMySql(pool);
    const catEmployeeRepository = new CatEmployeeRepositoryMySql(pool);
    const pictureTagRepository = new PictureTagRepositoryMySql(pool);
    const pictureService = new PictureService(pictureRepository, catEmployeeRepository);
    const jwtTokenManagement = new JwtTokenManagement(config.authentication);

    PictureRoutes(
        app,
        pictureService,
        pictureService,
        new CachingResizedPictureFileService(new ResizingPictureFileService(pictureService)),
        jwtTokenManagement,
    );

    PictureTagRoutes(
        app,
        new TagService(pictureTagRepository),
        new PictureTagService(catEmployeeRepository, pictureRepository, pictureTagRepository),
        jwtTokenManagement,
    );

    CatEmployeeRoutes(
        app,
        new CatEmployeeEntry(catEmployeeRepository, new BCryptEncoder(config.security.encoder)),
        jwtTokenManagement,
    );

    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}/`);
    });
})();
