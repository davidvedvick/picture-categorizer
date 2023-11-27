import {Express} from "express";
import {ServePictures} from "./ServePictures.js";
import {ManageJwtTokens} from "../security/ManageJwtTokens.js";
import {UploadedFile} from "express-fileupload";
import {PictureAlreadyExistsException} from "./PictureAlreadyExistsException.js";
import {UnknownCatEmployeeException} from "../users/UnknownCatEmployeeException.js";
import Jimp from "jimp";

export default function(app: Express, pictureService: ServePictures, manageJwtTokens: ManageJwtTokens) {

    app.get("/api/pictures", async (req, res) => {
        const pageNumberString = req.query["page"];
        const pageNumber = pageNumberString ? Number(pageNumberString) : null;

        const pageSizeString = req.query["size"];
        const pageSize = pageSizeString ? Number(pageSizeString) : null;

        res.send(await pictureService.getPictureInformation(pageNumber, pageSize))
    });

    app.get("/api/pictures/:id/file", async (req, res) => {
        const idString = req.params.id;
        if (!idString) {
            res.sendStatus(400);
            return;
        }

        const id = Number(idString);

        const picture = await pictureService.getPictureFile(id);
        if (!picture) {
            res.sendStatus(404);
            return;
        }

        const image = await Jimp.read(Buffer.from(picture.file));

        res
            .set("cache-control", "public, max-age=31536000, immutable")
            .type(picture.mimeType)
            .send(await image.resize(400, Jimp.AUTO).getBufferAsync(picture.mimeType));
    });

    app.post("/api/pictures", async (req, res) => {
        const token = req.get('authorization');
        if (!token) {
            res.sendStatus(400);
            return;
        }

        const file = req.files?.file;

        if (!file) {
            res.sendStatus(400);
            return;
        }

        const uploadedFile = file as UploadedFile;

        const fileName = uploadedFile.name;
        if (!fileName) {
            res.sendStatus(400);
            return;
        }

        const authenticatedUser = await manageJwtTokens.decodeToken(token);
        if (!authenticatedUser || !authenticatedUser.email) {
            res.sendStatus(403);
            return;
        }

        try {
            const picture = await pictureService.addPicture(
                {
                    fileName: fileName,
                    file: uploadedFile.data,
                    mimeType: uploadedFile.mimetype,
                },
                authenticatedUser);
            res.status(202).send(picture);
        } catch (e) {
            if (e instanceof PictureAlreadyExistsException) {
                res.sendStatus(409);
                return;
            }

            if (e instanceof UnknownCatEmployeeException) {
                res.sendStatus(403);
                return;
            }

            console.error("An error occurred uploading the picture.", e);
            res.status(500).send("I'm not sure what happened here.");
        }
    });
}