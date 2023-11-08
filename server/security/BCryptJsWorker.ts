import workerPool from 'workerpool';
import {hashSync, genSaltSync, compareSync} from "bcryptjs";

let salt: string | null = "";

function lazySalt() {
    return salt ?? (salt = genSaltSync(10));
}

function hash(s: string) {
    return hashSync(s, lazySalt());
}

function compare(s: string, hash: string) {
    return compareSync(s, hash);
}

workerPool.worker({
    compare: compare,
    hash: hash,
});

export const pool = workerPool.pool();