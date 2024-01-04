import express, { json, urlencoded } from "express";
import PictureRoutes from "./pictures/PictureRoutes.js";
import { PictureRepository } from "./pictures/PictureRepository.js";
import { PictureService } from "./pictures/PictureService.js";
import { CatEmployeeRepository } from "./users/CatEmployeeRepository.js";
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
import { ResizingPictureFileService } from "./pictures/resizing/ResizingPictureFileService.js";
import { CachingResizedPictureFileService } from "./pictures/CachingPictureFileService.js";
import PictureTagRoutes from "./pictures/tags/PictureTagRoutes.js";
import { PictureTagService } from "./pictures/tags/PictureTagService.js";
import { PictureTagRepository } from "./pictures/tags/PictureTagRepository.js";
import { TagService } from "./pictures/tags/TagService.js";
import Database from "better-sqlite3";

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

if (config.security.wellKnownLocation) app.use("/.well-known", express.static(config.security.wellKnownLocation));

const port = 5000;

(async () => {
    const database = new Database(config.db.file);
    database.pragma("journal_mode = WAL");
    await migrator(database);

    const pictureRepository = new PictureRepository(database);
    const catEmployeeRepository = new CatEmployeeRepository(database);
    const pictureTagRepository = new PictureTagRepository(database);
    const pictureService = new PictureService(pictureRepository, catEmployeeRepository);
    const jwtTokenManagement = new JwtTokenManagement(config.authentication);

    PictureRoutes(
        app,
        pictureService,
        pictureService,
        new CachingResizedPictureFileService(
            new ResizingPictureFileService(pictureService),
            pictureRepository,
            database,
        ),
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
