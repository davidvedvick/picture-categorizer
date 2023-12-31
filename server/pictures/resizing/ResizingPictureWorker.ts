import { parentPort } from "worker_threads";
import Jimp from "jimp";
import { ResizeMessage } from "./ResizeMessage.js";

// eslint-disable-next-line prefer-const
let timeout: NodeJS.Timeout | undefined;

const listener = parentPort?.on("message", async (message: ResizeMessage) => {
    timeout?.refresh();

    const image = await Jimp.read(Buffer.from(message.file));

    const resizedImage =
        image.getWidth() > image.getHeight() ? image.resize(400, Jimp.AUTO) : image.resize(Jimp.AUTO, 400);

    const resizedImageBuffer = await resizedImage.getBufferAsync(message.mimeType);

    parentPort?.postMessage({
        file: resizedImageBuffer,
        mimeType: message.mimeType,
    } as ResizeMessage);
});

timeout = setTimeout(() => {
    listener?.close();
}, 60_000);
