import {Express} from "express";
import {ServePictures} from "./ServePictures.js";
import {ManagePictures} from "./ManagePictures.js";
import {ManageJwtTokens} from "../security/ManageJwtTokens.js";
import {UploadedFile} from "express-fileupload";
import PictureFile from "./PictureFile.js";
import {PictureAlreadyExistsException} from "./PictureAlreadyExistsException.js";
import {UnknownCatEmployeeException} from "../users/UnknownCatEmployeeException.js";

export default function(app: Express, pictureService: ServePictures, pictureRepository: ManagePictures, manageJwtTokens: ManageJwtTokens) {

    app.get("/api/pictures", async (req, res) => {
        const pageNumberString = req.query["page"];
        const pageNumber = pageNumberString ? Number(pageNumberString) : null;

        const pageSizeString = req.query["size"];
        const pageSize = pageSizeString ? Number(pageSizeString) : null;

        res.send(await pictureService.getPictures(pageNumber, pageSize))
    });

    app.get("/api/pictures/:id/file", async (req, res) => {
        const idString = req.params.id;
        if (!idString) {
            res.status(400);
            return;
        }

        const id = Number(idString);

        const file = await pictureRepository.findFileById(id);

        res.send(file);
    });

    app.post("/api/pictures", async (req, res) => {
        const token = req.get('authorization');
        if (!token) {
            res.sendStatus(400);
            return;
        }

        const authenticatedUser = await manageJwtTokens.decodeToken(token);
        if (!authenticatedUser || !authenticatedUser.email) {
            res.sendStatus(403);
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

        const pictureFile: PictureFile = {
            file: uploadedFile.data,
            fileName: fileName,
        }

        try {
            const picture = await pictureService.addPicture(pictureFile, authenticatedUser);
            res.status(202).send(picture);
        } catch (e) {
            if (e instanceof PictureAlreadyExistsException) {
                res.sendStatus(409);
                return;
            }

            if (e instanceof UnknownCatEmployeeException) {
                res.sendStatus(401);
                return;
            }

            console.error("An error occurred uploading the picture.", e);
            res.status(500).send("Well that was unexpected.");
        }
    });
}