import PictureFile from "../PictureFile.js";
import { ServePictureFiles, ServeResizedPictureFiles } from "../ServePictureFiles.js";
import { Worker } from "worker_threads";
import os from "os";
import { fileURLToPath } from "url";
import { ResizeMessage } from "./ResizeMessage.js";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*
  Export a function that queues pending work.
 */

interface Job {
    resolve: (value: Uint8Array) => void;
    reject: (error: unknown) => void;
    message: ResizeMessage;
}

const queue: Job[] = [];

/*
  Instruct workers to drain the queue.
 */

interface LocalWorker {
    takeWork(): void;
    isActive(): boolean;
}

let workers: LocalWorker[] = [];

const cpus = os.cpus();
async function drainQueue() {
    for (const worker of workers) {
        worker.takeWork();
    }

    while (queue.length && workers.length < cpus.length) {
        workers.push(await spawn());

        for (const worker of workers) {
            worker.takeWork();
        }
    }
}

/*
  Spawn workers that try to drain the queue.
 */

async function spawn() {
    const worker = new Worker(join(__dirname, "ResizingPictureWorker.js"));

    let job: Job | undefined; // Current item from the queue
    let error: Error | null = null; // Error that caused the worker to crash

    function takeWork() {
        if (job) return;

        // If there's a job in the queue, send it to the worker
        job = queue.shift();
        if (!job) {
            return;
        }

        worker.postMessage(job.message);
    }

    await new Promise((resolve, reject) => {
        worker.on("online", resolve).on("error", reject);
    });

    worker
        .on("message", (result: ResizeMessage) => {
            job?.resolve(result.file);
            job = undefined;
            takeWork(); // Check if there's more work to do
        })
        .on("error", (err) => {
            console.error(err);
            error = err;
        })
        .on("exit", (code) => {
            workers = workers.filter((w) => w.takeWork !== takeWork);

            job?.reject(error || new Error("worker died"));

            if (code !== 0) {
                console.error(`worker exited with code ${code}`);
            }
        });

    return {
        takeWork,
        isActive: () => !!job,
    };
}

function promiseResize(message: ResizeMessage) {
    return new Promise<Uint8Array>((resolve, reject) => {
        queue.push({
            resolve,
            reject,
            message,
        });
        drainQueue().catch(reject);
    });
}

export class ResizingPictureFileService implements ServeResizedPictureFiles {
    constructor(private readonly inner: ServePictureFiles) {}

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const pictureFile = await this.inner.getPictureFile(id);

        if (!pictureFile) return null;

        const resizedImageBuffer = await promiseResize({ ...pictureFile });

        return {
            file: Buffer.from(resizedImageBuffer),
            fileName: pictureFile.fileName,
            mimeType: pictureFile.mimeType,
        };
    }
}
