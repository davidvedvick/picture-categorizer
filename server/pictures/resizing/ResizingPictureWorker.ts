import { parentPort } from "worker_threads";
import Jimp from "jimp";
import { ResizeMessage } from "./ResizeMessage.js";

const handler = async (message: ResizeMessage | string) => {
    if (message === "shutdown") {
        parentPort?.off("message", handler);
        process.exit();
    }

    const { file, mimeType } = message as ResizeMessage;

    const image = await Jimp.read(file instanceof Buffer ? file : Buffer.from(file.buffer));

    const resizedImage =
        image.getWidth() > image.getHeight() ? image.resize(400, Jimp.AUTO) : image.resize(Jimp.AUTO, 400);

    const resizedImageBuffer = await resizedImage.getBufferAsync(mimeType);

    parentPort?.postMessage({
        file: resizedImageBuffer,
        mimeType: mimeType,
    } as ResizeMessage);
};

parentPort?.on("message", handler);
