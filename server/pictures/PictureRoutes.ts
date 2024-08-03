import express, { Express } from "express";
import { ServePictureInformation } from "./ServePictureInformation.js";
import { ManageJwtTokens } from "../security/ManageJwtTokens.js";
import { UploadedFile } from "express-fileupload";
import { PictureAlreadyExistsException } from "./PictureAlreadyExistsException.js";
import { UnknownCatEmployeeException } from "../users/UnknownCatEmployeeException.js";
import { ServePictureFiles, ServeResizedPictureFiles } from "./ServePictureFiles.js";

export default function (
    app: Express,
    pictureService: ServePictureInformation,
    pictureFileService: ServePictureFiles,
    resizedPictureFileService: ServeResizedPictureFiles,
    manageJwtTokens: ManageJwtTokens,
) {
    app.get("/api/pictures", async (req, res) => {
        const pageNumberString = req.query.page;
        const pageNumber = pageNumberString ? Number(pageNumberString) : null;

        const pageSizeString = req.query.size;
        const pageSize = pageSizeString ? Number(pageSizeString) : null;

        res.send(await pictureService.getPictureInformationPages(pageNumber, pageSize));
    });

    app.get("/api/pictures/:id", async (req, res) => {
        const idString = req.params.id;
        if (!idString) {
            res.sendStatus(400);
            return;
        }

        const id = Number(idString);

        res.send(await pictureService.getPictureInformation(id));
    });

    app.get("/api/pictures/:id/file", handlePictureFileRequests(pictureFileService));

    app.get("/api/pictures/:id/preview", handlePictureFileRequests(resizedPictureFileService));

    app.post("/api/pictures", async (req, res) => {
        const token = req.get("authorization");
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
            res.sendStatus(401);
            return;
        }

        try {
            const picture = await pictureService.addPicture(
                {
                    fileName: fileName,
                    file: uploadedFile.data,
                    mimeType: uploadedFile.mimetype,
                },
                authenticatedUser,
            );
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

    function handlePictureFileRequests(
        pictureFiles: ServePictureFiles,
    ): (req: express.Request, res: express.Response) => Promise<void> {
        return async (req, res) => {
            const idString = req.params.id;
            if (!idString) {
                res.sendStatus(400);
                return;
            }

            const id = Number(idString);

            const picture = await pictureFiles.getPictureFile(id);

            if (!picture) {
                res.sendStatus(404);
                return;
            }

            res.set("cache-control", "public, max-age=31536000, immutable").type(picture.mimeType).send(picture.file);
        };
    }
}
