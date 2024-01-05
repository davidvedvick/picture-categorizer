import Jimp from "jimp";
import { PictureRepository } from "../PictureRepository.js";
import Database from "better-sqlite3";
import config from "../../AppConfig.js";
import { ResizedPictureRepository } from "./ResizedPictureRepository.js";
import { ResizePictureRequest } from "./ResizePictureRequest.js";
import { ResizedPictureId } from "./ResizedPictureId.js";

const database = new Database(config.db.file);
database.pragma("journal_mode = WAL");

const pictureRepository = new PictureRepository(database);
const resizePictureRepository = new ResizedPictureRepository(database);

const { off, on, exit, send } = process;

async function handler(message: ResizePictureRequest | string) {
    if (message === "shutdown") {
        console.log(`Worker ${process.pid} is shutting down.`);
        off("message", handler);
        exit();
    }

    const resizePictureRequest = message as ResizePictureRequest;

    let resizedPictureId: ResizedPictureId | null;
    while (!(resizedPictureId = resizePictureRepository.findByRequest(resizePictureRequest))) {
        try {
            const pictureId = resizePictureRequest.pictureId;
            const pictureInformation = await pictureRepository.findById(pictureId);
            const pictureFile = await pictureRepository.findFileById(pictureId);
            if (!pictureFile || !pictureInformation) {
                if (send) {
                    send("not_found");
                }

                return;
            }

            const image = await Jimp.read(pictureFile);

            const resizedImage =
                image.getWidth() > image.getHeight()
                    ? image.resize(resizePictureRequest.maxWidth, Jimp.AUTO)
                    : image.resize(Jimp.AUTO, resizePictureRequest.maxHeight);

            const resizedImageBuffer = await resizedImage.getBufferAsync(pictureInformation.mimeType);
            resizePictureRepository.save({
                file: resizedImageBuffer,
                ...resizePictureRequest,
            });
        } catch (e) {
            console.error(`An error occurred inserting the resized picture request: ${resizePictureRequest}`);
        }
    }

    if (send) {
        send(resizedPictureId);
    }
}

on("message", handler);

if (send) {
    send("online");
}
