import { exec } from "child_process";
import * as fs from "fs/promises";

const promiseExec = (command) =>
    new Promise((resolve, reject) => {
        const childProcess = exec(command, (err, out) => {
            if (err) {
                reject(err);
            }

            resolve(out);
        });

        childProcess.stderr.pipe(process.stderr);
        childProcess.stdout.pipe(process.stdout);
    });

(async () => {
    await promiseExec("npm --prefix transfer run build");
    await Promise.all([promiseExec("npm --prefix server run publish"), promiseExec("npm --prefix frontend run build")]);

    await fs.cp("./frontend/build", "./server/build/public", { recursive: true });

    process.exit();
})();
