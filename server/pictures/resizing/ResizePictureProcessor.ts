import { fork } from "node:child_process";
import os from "os";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { ResizePictureRequest } from "./ResizePictureRequest.js";
import { ResizedPictureId } from "./ResizedPictureId.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*
  Export a function that queues pending work.
 */

interface Job {
    resolve: (value: ResizedPictureId | null) => void;
    reject: (error: unknown) => void;
    message: ResizePictureRequest;
}

const queue: Job[] = [];

/*
  Instruct workers to drain the queue.
 */

interface LocalWorker {
    takeWork(): void;
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
    const worker = fork(join(__dirname, "ResizingPictureWorker.js"));
    const pid = worker.pid;

    let job: Job | undefined; // Current item from the queue
    let error: Error | null = null; // Error that caused the worker to crash

    function scheduleShutdown() {
        setTimeout(() => {
            if (queue.length) {
                takeWork();
                return;
            }

            if (job || !worker.pid || worker.pid == -1) {
                // -1 signals worker is already shutdown.
                return;
            }

            console.log(`Shutting down worker ${pid}.`);
            // pre-emptively take worker out of pool
            workers = workers.filter((w) => w.takeWork !== takeWork);
            worker.send("shutdown");
        }, 60_000);
    }

    function takeWork() {
        if (job) return;

        job = queue.shift();
        // Without a job, shutdown
        if (!job) {
            scheduleShutdown();
            return;
        }

        // If there's a job in the queue, send it to the worker
        worker.send(job.message);
    }

    await new Promise((resolve) => {
        worker.once("message", (message) => {
            if (message === "online") {
                resolve(null);
            }
        });
    });

    worker
        .on("message", (result: ResizedPictureId | string) => {
            if (result === "not_found") {
                job?.resolve(null);
            }

            job?.resolve(result as ResizedPictureId);
            job = undefined;
            takeWork(); // Check if there's more work to do
        })
        .on("error", (err) => {
            console.error(err);
            error = err;
        })
        .on("close", (code) => {
            workers = workers.filter((w) => w.takeWork !== takeWork);

            console.log(`Worker ${pid} exited with code ${code}.`);
            if (code !== 0) {
                job?.reject(error || new Error(`worker died with code ${code}`));
            }
        });

    return {
        takeWork,
    };
}

export interface ProcessPictureResizeRequests {
    promiseResize(message: ResizePictureRequest): Promise<ResizedPictureId | null>;
}

export class ResizePictureProcessor implements ProcessPictureResizeRequests {
    promiseResize(message: ResizePictureRequest) {
        return new Promise<ResizedPictureId | null>((resolve, reject) => {
            queue.push({ resolve, reject, message });
            drainQueue().catch(reject);
        });
    }
}
